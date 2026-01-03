namespace EmuSync.Domain.Objects;

public record SyncProgress
{
    public double OverallCompletionPercent { get; set; }
    public string CurrentStage { get; set; }
}
