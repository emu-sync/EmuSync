namespace EmuSync.Agent.Services.Interfaces;

public interface IGameSyncService
{
    Task ManageWatchersAsync(bool createSyncTasksIfAutoSync, List<GameEntity>? games = null, bool checkForExternalSource = false, CancellationToken cancellationToken = default);
}
