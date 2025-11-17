using EmuSync.Domain.Enums;

namespace EmuSync.Agent.Services.Interfaces;

public interface IGameSyncStatusCache
{
    void AddOrUpdate(string gameId, GameSyncStatus status);

    GameSyncStatus Get(string gameId);
}