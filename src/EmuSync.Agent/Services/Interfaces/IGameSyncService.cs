namespace EmuSync.Agent.Services.Interfaces;

public interface IGameSyncService
{
    Task ManageWatchersAsync(bool createSyncTasksIfAutoSync, List<GameEntity>? games = null, CancellationToken cancellationToken = default);
}
