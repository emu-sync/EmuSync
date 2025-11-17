namespace EmuSync.Agent.Services.Interfaces;

public interface IGameFileWatchService
{
    /// <summary>
    /// Updates or removes a watcher 
    /// </summary>
    /// <param name="syncSourceId"></param>
    /// <param name="game"></param>
    void ModifyOrRemoveWatcher(string syncSourceId, GameEntity game);

    /// <summary>
    /// Removes a watcher
    /// </summary>
    /// <param name="gameId"></param>
    void RemoveWatcher(string gameId);

    /// <summary>
    /// Removes all watchers
    /// </summary>
    void RemoveAllWatchers();

    /// <summary>
    /// Gets a list of all active watchers game IDs
    /// </summary>
    /// <returns></returns>
    List<string> GetFileWatcherKeys();

    /// <summary>
    /// Gets the next sync task ready for processing
    /// </summary>
    /// <returns></returns>
    GameEntity? GetNextSyncTask();

    /// <summary>
    /// Adds a sync task
    /// </summary>
    /// <param name="game"></param>
    void AddSyncTask(GameEntity game);
}
