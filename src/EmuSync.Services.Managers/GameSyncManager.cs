using EmuSync.Domain;
using EmuSync.Domain.Enums;
using EmuSync.Domain.Helpers;
using EmuSync.Domain.Objects;
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
    IGameManager gameManager,
    ILocalSyncLog localSyncLog,
    ILocalGameSaveBackupService localGameSaveBackupService,
    ISyncProgressTracker syncProgressTracker
) : BaseManager(logger, localDataAccessor, storageProviderFactory), IGameSyncManager
{
    private readonly IGameManager _gameManager = gameManager;
    private readonly ILocalSyncLog _localSyncLog = localSyncLog;
    private readonly ILocalGameSaveBackupService _localGameSaveBackupService = localGameSaveBackupService;
    private readonly ISyncProgressTracker _syncProgressTracker = syncProgressTracker;

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

    public async Task<GameSyncStatus> SyncGameAsync(
        string syncSourceId,
        GameEntity game,
        bool isAutoSync,
        CancellationToken cancellationToken = default
    )
    {
        GetSyncTypeResult syncTypeResult = GetSyncType(syncSourceId, game);

        switch (syncTypeResult.SyncStatus)
        {
            case GameSyncStatus.RequiresDownload:

                await DownloadGameFilesAsync(
                    syncTypeResult.FolderPath,
                    game,
                    isAutoSync,
                    cancellationToken
                );

                return GameSyncStatus.InSync;

            case GameSyncStatus.RequiresUpload:

                await UploadGameFilesAsync(
                    syncSourceId,
                    syncTypeResult.FolderPath,
                    game,
                    isAutoSync,
                    syncTypeResult.DirectoryScanResult,
                    cancellationToken
                );

                return GameSyncStatus.InSync;

            default:
                return syncTypeResult.SyncStatus;
        }
    }

    public async Task ForceDownloadGameAsync(
        string syncSourceId,
        GameEntity game,
        bool isAutoSync,
        CancellationToken cancellationToken = default
    )
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
            isAutoSync,
            cancellationToken
        );
    }

    public async Task ForceUploadGameAsync(
        string syncSourceId,
        GameEntity game,
        bool isAutoSync,
        CancellationToken cancellationToken = default
    )
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
            isAutoSync,
            scanResult,
            cancellationToken
        );
    }

    public async Task RestoreFromBackup(
        string syncSourceId,
        GameEntity game,
        string backupId,
        CancellationToken cancellationToken = default
    )
    {
        string? folderPath = null;
        game.SyncSourceIdLocations?.TryGetValue(syncSourceId, out folderPath);

        if (string.IsNullOrEmpty(folderPath))
        {
            throw new ArgumentNullException("No sync location has been set");
        }

        await _localGameSaveBackupService.RestoreBackupAsync(game.Id, backupId, folderPath, cancellationToken);
        DirectoryScanResult scanResult = LocalDataAccessor.ScanDirectory(folderPath);

        await UploadGameFilesAsync(
            syncSourceId,
            folderPath,
            game,
            isAutoSync: false,
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
        bool isAutoSync,
        CancellationToken cancellationToken = default
    )
    {
        SyncProgress? syncProgress = _syncProgressTracker.Get(game.Id);

        if (syncProgress != null)
        {
            Logger.LogInformation("A sync is already in progress for game {gameId} - skipping download", game.Id);
        }

        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);

        string tempZipPath = GetTempZipPath();

        try
        {
            _syncProgressTracker.UpdateStage(game.Id, "Downloading game files");

            string fileName = string.Format(StorageConstants.FileName_GameZip, game.Id);

            await storageProvider.GetZipFileAsync(
                fileName,
                tempZipPath,
                (progress) => _syncProgressTracker.UpdateStageCompletionPercent(game.Id, progress, 0, 70),
                cancellationToken
            );

            bool tempZipFileExists = File.Exists(tempZipPath);
            if (!tempZipFileExists) return;

            //create a backup first before we extract the latest files
            _syncProgressTracker.UpdateStage(game.Id, "Creating backup");

            await _localGameSaveBackupService.CreateBackupAsync(
                game.Id,
                path,
                (progress) => _syncProgressTracker.UpdateStageCompletionPercent(game.Id, progress, 70, 85),
                cancellationToken
            );

            _syncProgressTracker.UpdateStage(game.Id, "Extracting game files");

            using var fileStream = new FileStream(tempZipPath, FileMode.Open, FileAccess.Read);

            ZipHelper.ExtractToDirectory(
                fileStream,
                path,
                game.LatestWriteTimeUtc,
                (progress) => _syncProgressTracker.UpdateStageCompletionPercent(game.Id, progress, 85, 100)
            );

            try
            {
                await _localSyncLog.WriteLogAsync(game.Id, SyncType.Download, isAutoSync, cancellationToken);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Failed to wite local sync log");
            }

        }
        catch
        {
            throw;
        }
        finally
        {
            _syncProgressTracker.Remove(game.Id);
            DeleteFileIfExsts(tempZipPath);
        }
    }

    private async Task UploadGameFilesAsync(
        string syncSourceId,
        string path,
        GameEntity game,
        bool isAutoSync,
        DirectoryScanResult scanResult,
        CancellationToken cancellationToken = default
    )
    {
        SyncProgress? syncProgress = _syncProgressTracker.Get(game.Id);

        if (syncProgress != null)
        {
            Logger.LogInformation("A sync is already in progress for game {gameId} - skipping upload", game.Id);
        }

        var storageProvider = await GetRequiredStorageProviderAsync(cancellationToken);

        string tempZipPath = GetTempZipPath();

        try
        {
            _syncProgressTracker.UpdateStage(game.Id, "Compressing game files");

            //create a physical zip
            ZipHelper.CreateZipFromFolder(
                path,
                tempZipPath,
                (progress) => _syncProgressTracker.UpdateStageCompletionPercent(game.Id, progress, 0, 30)
            );

            string fileName = string.Format(StorageConstants.FileName_GameZip, game.Id);

            _syncProgressTracker.UpdateStage(game.Id, "Uploading game files");
            Logger.LogInformation("Uploading game files {fileName}", fileName);

            using var fileStream = new FileStream(tempZipPath, FileMode.Open, FileAccess.Read);

            await storageProvider.UpsertZipDataAsync(
                fileName,
                fileStream,
                (progress) => _syncProgressTracker.UpdateStageCompletionPercent(game.Id, progress, 30, 90),
                cancellationToken
            );

            game.LastSyncedFrom = syncSourceId;
            game.LastSyncTimeUtc = DateTime.UtcNow;
            game.LatestWriteTimeUtc = scanResult.LatestWriteTimeUtc;
            game.StorageBytes = scanResult.StorageBytes;

            _syncProgressTracker.UpdateStage(game.Id, "Updating metadata");
            Logger.LogInformation("Saving game data {gameName}", game.Name);

            await _gameManager.UpdateMetaDataAsync(
                game,
                (progress) => _syncProgressTracker.UpdateStageCompletionPercent(game.Id, progress, 90, 100),
                cancellationToken
            );

            try
            {
                await _localSyncLog.WriteLogAsync(game.Id, SyncType.Upload, isAutoSync, cancellationToken);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Failed to wite local sync log");
            }

        }
        catch
        {
            throw;
        }
        finally
        {
            _syncProgressTracker.Remove(game.Id);
            DeleteFileIfExsts(tempZipPath);
        }
    }

    private string GetTempZipPath()
    {
        string tempZipName = $"{IdHelper.Create()}.zip";

        return LocalDataAccessor.GetLocalFilePath(
            Path.Combine(DomainConstants.LocalDataGameTempZipsFolder, tempZipName)
        );
    }

    private void DeleteFileIfExsts(string filePath)
    {
        try
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
        catch (Exception ex)
        {
            Logger.LogError("Failed to delete file {file}", filePath);
        }
    }
}