namespace EmuSync.Agent.Services.Interfaces;

public interface IApiCache
{
    CacheSlot<List<GameEntity>> Games { get; }
    GameEntity? GetGame(string id);
    void UpdateGame(GameEntity game);

    CacheSlot<List<SyncSourceEntity>> SyncSources { get; }
}
