using EmuSync.Domain.Enums;
using System.Collections.Concurrent;

namespace EmuSync.Agent.Services;

public class GameSyncStatusCache : IGameSyncStatusCache
{
    public ConcurrentDictionary<string, GameSyncStatus> _gameSyncStatuses = new();

    public void AddOrUpdate(string gameId, GameSyncStatus status)
    {
        _gameSyncStatuses.AddOrUpdate(gameId, x => status, (_, _) => status);
    }

    public GameSyncStatus Get(string gameId)
    {
        _gameSyncStatuses.TryGetValue(gameId, out var status);
        return status;
    }
}
