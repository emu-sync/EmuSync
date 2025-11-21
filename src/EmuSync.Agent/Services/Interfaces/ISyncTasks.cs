namespace EmuSync.Agent.Services.Interfaces;

public interface ISyncTasks
{
    bool HasTasks();
    GameEntity? GetNext();
    void Add(GameEntity game);
    bool Update(GameEntity game);
    bool Remove(string gameId);
    void Clear();
}
