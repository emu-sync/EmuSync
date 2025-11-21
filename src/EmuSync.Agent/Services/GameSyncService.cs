using EmuSync.Domain.Enums;
using EmuSync.Services.Managers.Interfaces;

namespace EmuSync.Agent.Services;

public class GameSyncService(
    ILogger<GameSyncService> logger,
    ISyncTasks syncTasks,
    IGameSyncStatusCache gameSyncStatusCache,
    IGameManager gameManager,
    IGameSyncManager gameSyncManager,
    ISyncSourceManager syncSourceManager
) : IGameSyncService
{
    private readonly ILogger<GameSyncService> _logger = logger;
    private readonly ISyncTasks _syncTasks = syncTasks;
    private readonly IGameSyncStatusCache _gameSyncStatusCache = gameSyncStatusCache;
    private readonly IGameManager _gameManager = gameManager;
    private readonly IGameSyncManager _gameSyncManager = gameSyncManager;
    private readonly ISyncSourceManager _syncSourceManager = syncSourceManager;

    public async Task TryDetectGameChangesAsync(CancellationToken cancellationToken = default)
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


            SyncSourceEntity? externalSyncSource = await _syncSourceManager.GetAsync(syncSource.Id, cancellationToken);

            //this device no longer exists in the storage provider? It's probably been removed from another device
            if (externalSyncSource == null)
            {
                await HandleRemovedDeviceAsync(syncSource, cancellationToken);
                return;
            }

            await DetectChangesAsync(syncSource, cancellationToken);

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GameSyncService execution");
        }
    }

    public async Task TryDetectGameSyncStatusesAsync(List<GameEntity> games, CancellationToken cancellationToken = default)
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

            foreach (var game in games)
            {
                TryDetermineSyncType(syncSource, game);
            }

        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GameSyncService execution");
        }
    }

    private async Task DetectChangesAsync(SyncSourceEntity syncSource, CancellationToken cancellationToken = default)
    {
        List<GameEntity> games = await TryGetGamesAsync(cancellationToken);

        foreach (GameEntity game in games)
        {
            if (cancellationToken.IsCancellationRequested) break;

            await DetectChangesForGameAsync(syncSource, game, cancellationToken);
        }
    }


    private async Task DetectChangesForGameAsync(SyncSourceEntity syncSource, GameEntity game, CancellationToken cancellationToken)
    {
        try
        {
            GameSyncStatus gameSyncStatus = TryDetermineSyncType(syncSource, game);

            if (!game.AutoSync)
            {
                _syncTasks.Remove(game.Id);
                return;
            }

            if (gameSyncStatus == GameSyncStatus.RequiresDownload || gameSyncStatus == GameSyncStatus.RequiresUpload)
            {
                _syncTasks.Add(game);
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

    private async Task HandleRemovedDeviceAsync(SyncSourceEntity syncSource, CancellationToken cancellationToken)
    {
        _syncTasks.Clear();
        await _syncSourceManager.UnlinkLocalStorageProviderAsync(syncSource, false, cancellationToken);
    }
}