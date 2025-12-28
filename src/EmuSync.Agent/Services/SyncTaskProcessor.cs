using EmuSync.Domain.Enums;
using EmuSync.Services.Managers.Interfaces;

namespace EmuSync.Agent.Services;

public class SyncTaskProcessor(
    ILogger<SyncTaskProcessor> logger,
    IGameSyncStatusCache gameSyncStatusCache,
    IGameSyncManager gameSyncManager,
    ISyncSourceManager syncSourceManager,
    IApiCache apiCache
) : ISyncTaskProcessor
{
    private readonly ILogger<SyncTaskProcessor> _logger = logger;
    private readonly IGameSyncStatusCache _gameSyncStatusCache = gameSyncStatusCache;
    private readonly IGameSyncManager _gameSyncManager = gameSyncManager;
    private readonly ISyncSourceManager _syncSourceManager = syncSourceManager;
    private readonly IApiCache _apiCache = apiCache;

    public async Task ProcessSyncTaskAsync(GameEntity game, CancellationToken cancellationToken)
    {
        using var logScope = _logger.BeginScope("SyncTaskProcessor");

        try
        {
            SyncSourceEntity? syncSource = await _syncSourceManager.GetLocalAsync(cancellationToken);

            if (syncSource == null)
            {
                _logger.LogWarning("No sync source configured");
                return;
            }

            if (syncSource.StorageProvider == null)
            {
                _logger.LogWarning("No storage provider configured");
                return;
            }

            await ProcessTaskAsync(game, syncSource, cancellationToken);

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in SyncTaskProcessor execution");
        }
    }

    private async Task ProcessTaskAsync(GameEntity gameToSync, SyncSourceEntity syncSource, CancellationToken cancellationToken)
    {
        try
        {
            GameSyncStatus status = TryDetermineSyncType(syncSource, gameToSync);

            _logger.LogInformation("Processing a sync task for game {gameName} / {gameId} - status of {status}", gameToSync.Name, gameToSync.Id, status);

            switch (status)
            {
                case GameSyncStatus.RequiresDownload:
                    await _gameSyncManager.ForceDownloadGameAsync(syncSource.Id, gameToSync, isAutoSync: true, cancellationToken);
                    status = GameSyncStatus.InSync;
                    break;

                case GameSyncStatus.RequiresUpload:
                    await _gameSyncManager.ForceUploadGameAsync(syncSource.Id, gameToSync, isAutoSync: true, cancellationToken);
                    status = GameSyncStatus.InSync;
                    break;

                case GameSyncStatus.Unknown:
                case GameSyncStatus.UnsetDirectory:
                case GameSyncStatus.InSync:
                    break;
            }

            _logger.LogInformation("Sync task complete for game {gameName} / {gameId} - status of {status}", gameToSync.Name, gameToSync.Id, status);
            _gameSyncStatusCache.AddOrUpdate(gameToSync.Id, status);
            _apiCache.UpdateGame(gameToSync);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while syncing game {gameId}", gameToSync.Id);
        }
    }

    private GameSyncStatus TryDetermineSyncType(SyncSourceEntity syncSource, GameEntity game)
    {
        try
        {
            var syncTypeResult = _gameSyncManager.GetSyncType(syncSource.Id, game);
            _gameSyncStatusCache.AddOrUpdate(game.Id, syncTypeResult.SyncStatus);

            return syncTypeResult.SyncStatus;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while determining sync type {gameId}", game.Id);
        }

        return GameSyncStatus.Unknown;
    }
}