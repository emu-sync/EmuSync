using EmuSync.Domain.Enums;
using EmuSync.Services.Managers.Interfaces;

namespace EmuSync.Agent.Services;

public class SyncTaskService(
    ILogger<SyncTaskService> logger,
    IGameFileWatchService fileWatchService,
    IGameSyncStatusCache gameSyncStatusCache,
    IGameSyncManager gameSyncManager,
    ISyncSourceManager syncSourceManager
)
{
    private readonly ILogger<SyncTaskService> _logger = logger;
    private readonly IGameFileWatchService _fileWatchService = fileWatchService;
    private readonly IGameSyncStatusCache _gameSyncStatusCache = gameSyncStatusCache;
    private readonly IGameSyncManager _gameSyncManager = gameSyncManager;
    private readonly ISyncSourceManager _syncSourceManager = syncSourceManager;

    public async Task ProcessSyncTasks(CancellationToken cancellationToken)
    {
        using var logScope = _logger.BeginScope("GameSyncService");

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

            SyncSourceEntity? syncSourceFromProvider = await _syncSourceManager.GetAsync(syncSource.Id, cancellationToken);

            //if the sync source doesn't exist in the cloud - it's been deleted elsewhere
            if (syncSourceFromProvider == null)
            {
                _fileWatchService.RemoveAllWatchers();
                await _syncSourceManager.UnlinkLocalStorageProviderAsync(syncSource, writeToExternalList: false, cancellationToken);
                return;
            }

            await ProcessTasksAsync(syncSource, cancellationToken);

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GameSyncService execution");
        }
    }

    private async Task ProcessTasksAsync(SyncSourceEntity syncSource, CancellationToken cancellationToken)
    {
        List<GameEntity> failedSyncTask = [];

        GameEntity? gameToSync = _fileWatchService.GetNextSyncTask();

        while (gameToSync != null && !cancellationToken.IsCancellationRequested)
        {
            try
            {
                GameSyncStatus status = TryDetermineSyncType(syncSource, gameToSync);

                _logger.LogInformation("Processing a sync task for game {gameName} / {gameId} - status of {status}", gameToSync.Name, gameToSync.Id, status);

                switch (status)
                {
                    case GameSyncStatus.RequiresDownload:
                        await _gameSyncManager.ForceDownloadGameAsync(syncSource.Id, gameToSync, cancellationToken);
                        status = GameSyncStatus.InSync;
                        break;

                    case GameSyncStatus.RequiresUpload:
                        await _gameSyncManager.ForceUploadGameAsync(syncSource.Id, gameToSync, cancellationToken);
                        status = GameSyncStatus.InSync;
                        break;

                    case GameSyncStatus.Unknown:
                    case GameSyncStatus.UnsetDirectory:
                    case GameSyncStatus.InSync:
                        break;
                }

                _logger.LogInformation("Sync task complete for game {gameName} / {gameId} - status of {status}", gameToSync.Name, gameToSync.Id, status);
                _gameSyncStatusCache.AddOrUpdate(gameToSync.Id, status);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while syncing game {gameId}", gameToSync.Id);

                if (!failedSyncTask.Any(x => x.Id == gameToSync.Id))
                {
                    failedSyncTask.Add(gameToSync);
                }
            }

            gameToSync = _fileWatchService.GetNextSyncTask();
        }

        //put all failed sync tasks back in
        failedSyncTask.ForEach(task =>
        {
            _fileWatchService.AddSyncTask(task);
        });
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