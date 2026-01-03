using EmuSync.Domain.Objects;
using EmuSync.Domain.Services.Interfaces;
using System.Collections.Concurrent;

namespace EmuSync.Domain.Services;

public class SyncProgressTracker : ISyncProgressTracker
{
    private readonly ConcurrentDictionary<string, SyncProgress> _gameSyncProgress = new();

    public SyncProgress? Get(string id)
    {
        _gameSyncProgress.TryGetValue(id, out var progress);
        return progress;
    }

    public void Remove(string id)
    {
        _gameSyncProgress.TryRemove(id, out _);
    }

    public void UpdateStageCompletionPercent(string id, double stagePercent, double stageMinPercent, double stageMaxPercent)
    {
        // Clamp stagePercent to 0-100
        stagePercent = Math.Clamp(stagePercent, 0, 100);

        // Map stagePercent (0-100) to overall progress between stageMinPercent and stageMaxPercent
        double overall = stageMinPercent + (stagePercent / 100.0) * (stageMaxPercent - stageMinPercent);

        _gameSyncProgress.AddOrUpdate(
            id,
            _ => new SyncProgress
            {
                OverallCompletionPercent = overall
            },
            (_, existing) =>
            {
                existing.OverallCompletionPercent = overall;
                return existing;
            });
    }


    public void UpdateStage(string id, string stage)
    {
        _gameSyncProgress.AddOrUpdate(
            id,
            _ => new SyncProgress
            {
                CurrentStage = stage,
            },
            (_, existing) =>
            {
                existing.CurrentStage = stage;
                return existing;
            });
    }
}
