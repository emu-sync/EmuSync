namespace EmuSync.Agent.Services.Interfaces;

public interface ISyncTaskProcessor
{
    Task ProcessSyncTaskAsync(GameEntity game, CancellationToken cancellationToken);
}
