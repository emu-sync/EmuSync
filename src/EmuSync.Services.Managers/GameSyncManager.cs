using EmuSync.Domain.Enums;
using EmuSync.Domain.Helpers;
using EmuSync.Domain.Results;
using EmuSync.Services.Managers.Abstracts;
using EmuSync.Services.Managers.Interfaces;
using EmuSync.Services.Managers.Results;
using EmuSync.Services.Storage;
using EmuSync.Services.Storage.Interfaces;
using Microsoft.Extensions.Logging;

namespace EmuSync.Services.Managers;

public class GameSyncManager(
    ILogger<GameManager> logger,
    ILocalDataAccessor localDataAccessor,
    IStorageProviderFactory storageProviderFactory,
    IGameManager gameManager
) : BaseManager(logger, localDataAccessor, storageProviderFactory), IGameSyncManager
{
    private readonly IGameManager _gameManager = gameManager;

    public GetSyncTypeResult GetSyncType(string syncSourceId, GameEntity game)
    {
        GetSyncTypeResult result = new();

        string? folderPath = null;
        game.SyncSourceIdLocations?.TryGetValue(syncSourceId, out folderPath);

        DirectoryScanResult scanResult = LocalDataAccessor.ScanDirectory(folderPath);

        result.SyncStatus = DetermineSyncType(game, scanResult);
        result.FolderPath = folderPath!;
        result.DirectoryScanResult = scanResult;

        return result;
    }

    public async Task<GameSyncStatus> SyncGameAsync(string syncSourceId, GameEntity game, CancellationToken cancellationToken = default)
    {
        GetSyncTypeResult syncTypeResult = GetSyncType(syncSourceId, game);

        switch (syncTypeResult.SyncStatus)
        {
            case GameSyncStatus.RequiresDownload:

                await DownloadGameFilesAsync(
                    syncTypeResult.FolderPath,
                    game,
                    cancellationToken
                );

                return GameSyncStatus.InSync;

            case GameSyncStatus.RequiresUpload:

                await UploadGameFilesAsync(
                    syncSourceId,
                    syncTypeResult.FolderPath,
                    game,
                    syncTypeResult.DirectoryScanResult,
                    cancellationToken
                );

                return GameSyncStatus.InSync;

            default:
                return syncTypeResult.SyncStatus;
        }
    }

    public async Task ForceDownloadGameAsync(string syncSourceId, GameEntity game, CancellationToken cancellationToken = default)
    {
        string? folderPath = null;
        game.SyncSourceIdLocations?.TryGetValue(syncSourceId, out folderPath);

        if (string.IsNullOrEmpty(folderPath))
        {
            throw new ArgumentNullException("No sync location has been set");
        }

        await DownloadGameFilesAsync(
            folderPath,
            game,
            cancellationToken
        );
    }

    public async Task ForceUploadGameAsync(string syncSourceId, GameEntity game, CancellationToken cancellationToken = default)
    {
        string? folderPath = null;
        game.SyncSourceIdLocations?.TryGetValue(syncSourceId, out folderPath);

        if (string.IsNullOrEmpty(folderPath))
        {
            throw new ArgumentNullException("No sync location has been set");
        }

        DirectoryScanResult scanResult = LocalDataAccessor.ScanDirectory(folderPath);

        await UploadGameFilesAsync(
            syncSourceId,
            folderPath,
            game,
            scanResult,
            cancellationToken
        );
    }

    private GameSyncStatus DetermineSyncType(GameEntity game, DirectoryScanResult scanResult)
    {
        using var logScope = Logger.BeginScope("Determine sync type for game {gameName} / {gameId}", game.Name, game.Id);

        //game has never been synced before = must upload local data
        if (game.LastSyncTimeUtc == null)
        {
            if (scanResult.DirectoryExists)
            {
                Logger.LogDebug("No cloud sync exists - game should be uploaded");

                return GameSyncStatus.RequiresUpload;
            }

            Logger.LogDebug("No local files or directories found to upload");

            //nothing local to upload
            return GameSyncStatus.Unknown;
        }

        if (!scanResult.DirectoryIsSet)
        {
            Logger.LogDebug("No local directory is set - unknown sync status");

            return GameSyncStatus.UnsetDirectory;
        }

        //cloud record exists but local directory missing = need to download
        if (!scanResult.DirectoryExists && !scanResult.LatestDirectoryWriteTimeUtc.HasValue && game.LastSyncTimeUtc.HasValue)
        {
            Logger.LogDebug("No local directory found - game should be downloaded");

            return GameSyncStatus.RequiresDownload;
        }

        DateTime scanResultLatestWriteTime = scanResult.LatestWriteTimeUtc ?? DateTime.MinValue;
        DateTime gameLatestWriteTime = game.LatestWriteTimeUtc ?? DateTime.MinValue;

        //if local is newer than last sync = upload
        if (scanResultLatestWriteTime > gameLatestWriteTime)
        {
            Logger.LogDebug("Local version is newer - game should be uploaded");

            return GameSyncStatus.RequiresUpload;
        }
        else if (scanResultLatestWriteTime < gameLatestWriteTime)
        {
            Logger.LogDebug("Cloud version is newer - game should be downloaded");

            return GameSyncStatus.RequiresDownload;
        }

        Logger.LogDebug("Local version is in sync with cloud version");
        return GameSyncStatus.InSync;
    }

    private async Task DownloadGameFilesAsync(
        string path,
        GameEntity game,
        CancellationToken cancellationToken = default
    )
    {
        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);

        string fileName = string.Format(StorageConstants.FileName_GameZip, game.Id);
        using var stream = await storageProvider.GetZipFileAsync(fileName, cancellationToken);

        if (stream == null) return;

        ZipHelper.ExtractToDirectory(stream, path, game.LatestWriteTimeUtc);
    }

    private async Task UploadGameFilesAsync(
        string syncSourceId,
        string path,
        GameEntity game,
        DirectoryScanResult scanResult,
        CancellationToken cancellationToken = default
    )
    {

        //TODO: need to account for files being used by another process (I.e., the game is running)

        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);

        using var stream = ZipHelper.CreateZipFromFolder(path);

        string fileName = string.Format(StorageConstants.FileName_GameZip, game.Id);


        Logger.LogInformation("Uploading game files {fileName}", fileName);
        await storageProvider.UpsertZipDataAsync(fileName, stream, cancellationToken);

        game.LastSyncedFrom = syncSourceId;
        game.LastSyncTimeUtc = DateTime.UtcNow;
        game.LatestWriteTimeUtc = scanResult.LatestWriteTimeUtc;
        game.StorageBytes = scanResult.StorageBytes;

        Logger.LogInformation("Saving game data {gameName}", game.Name);
        await _gameManager.UpdateMetaDataAsync(game, cancellationToken);
    }
}