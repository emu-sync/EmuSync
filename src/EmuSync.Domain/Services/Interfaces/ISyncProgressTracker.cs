using EmuSync.Domain.Objects;

namespace EmuSync.Domain.Services.Interfaces;

public interface ISyncProgressTracker
{
    SyncProgress? Get(string id);
    void UpdateStageCompletionPercent(string id, double stagePercent, double stageMinPercent, double stageMaxPercent);
    void UpdateStage(string id, string stage);
    void Remove(string id);
}
