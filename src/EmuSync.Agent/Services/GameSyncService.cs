using EmuSync.Domain.Enums;
using EmuSync.Services.Managers.Interfaces;

namespace EmuSync.Agent.Services;

public class GameSyncService(
    ILogger<GameSyncService> logger,
    IGameFileWatchService fileWatchService,
    IGameSyncStatusCache gameSyncStatusCache,
    IGameManager gameManager,
    IGameSyncManager gameSyncManager,
    ISyncSourceManager syncSourceManager
)
{
    private readonly ILogger<GameSyncService> _logger = logger;
    private readonly IGameFileWatchService _fileWatchService = fileWatchService;
    private readonly IGameSyncStatusCache _gameSyncStatusCache = gameSyncStatusCache;
    private readonly IGameManager _gameManager = gameManager;
    private readonly IGameSyncManager _gameSyncManager = gameSyncManager;
    private readonly ISyncSourceManager _syncSourceManager = syncSourceManager;

    public async Task ManageWatchersAsync(bool createSyncTasksIfAutoSync, List<GameEntity>? games = null, CancellationToken cancellationToken = default)
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

            await ManageFileWatchersAsync(
                syncSource,
                createSyncTasksIfAutoSync,
                games,
                cancellationToken
            );

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GameSyncService execution");
        }
    }

    private async Task ManageFileWatchersAsync(
        SyncSourceEntity syncSource,
        bool createSyncTasksIfAutoSync,
        List<GameEntity>? games = null,
        CancellationToken cancellationToken = default
    )
    {
        if (games == null)
        {
            games = await TryGetGamesAsync(cancellationToken);
        }

        TryRemoveDeletedGames(games);

        foreach (var game in games)
        {
            if (cancellationToken.IsCancellationRequested) break;

            await ModifyGameWatcherAsync(syncSource, game, createSyncTasksIfAutoSync, cancellationToken);
        }
    }

    private void TryRemoveDeletedGames(List<GameEntity> games)
    {
        try
        {
            List<string> existingFileWatchers = _fileWatchService.GetFileWatcherKeys();

            List<string> deletedGames = existingFileWatchers
                .Where(watcherKey => !games.Any(game => game.Id == watcherKey))
                .ToList();

            deletedGames.ForEach(gameId =>
            {
                _fileWatchService.RemoveWatcher(gameId);
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while removing deleted game watchers");
        }
    }

    private async Task ModifyGameWatcherAsync(SyncSourceEntity syncSource, GameEntity game, bool createSyncTasksIfAutoSync, CancellationToken cancellationToken)
    {
        try
        {
            GameSyncStatus gameSyncStatus = TryDetermineSyncType(syncSource, game);

            if (!game.AutoSync)
            {
                _fileWatchService.RemoveWatcher(game.Id);
                return;
            }

            _fileWatchService.ModifyOrRemoveWatcher(syncSource.Id, game);

            //we only really want to create a sync task on first load and if auto sync is enabled
            //otherwise we're creating sync tasks for games that already have a file watch attached to them
            if (!createSyncTasksIfAutoSync) return;

            if (gameSyncStatus == GameSyncStatus.RequiresDownload || gameSyncStatus == GameSyncStatus.RequiresDownload)
            {
                _fileWatchService.AddSyncTask(game);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while modifying game watcher {gameId}", game);
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

    private async Task<List<GameEntity>> TryGetGamesAsync(CancellationToken cancellationToken)
    {
        try
        {
            List<GameEntity>? games = await _gameManager.GetListAsync(cancellationToken);
            return games ?? [];
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while retrieving game list");
            return [];
        }
    }
}