namespace EmuSync.Agent.Services.Interfaces;

public interface IGameSyncService
{
    Task TryDetectGameChangesAsync(CancellationToken cancellationToken = default);
    Task TryDetectGameSyncStatusesAsync(List<GameEntity> games, CancellationToken cancellationToken = default);
}
