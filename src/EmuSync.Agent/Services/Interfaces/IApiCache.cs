namespace EmuSync.Agent.Services.Interfaces;

public interface IApiCache
{
    CacheSlot<List<GameEntity>> Games { get; }
    GameEntity? GetGame(string id);

    CacheSlot<List<SyncSourceEntity>> SyncSources { get; }
}
