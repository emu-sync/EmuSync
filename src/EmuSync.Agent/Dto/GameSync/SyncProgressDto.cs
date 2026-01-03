using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.GameSync;

public record SyncProgressDto
{
    [JsonPropertyName("inProgress")]
    public bool InProgress { get; set; }

    [JsonPropertyName("overallCompletionPercent")]
    public double? OverallCompletionPercent { get; set; }

    [JsonPropertyName("currentStage")]
    public string? CurrentStage { get; set; }
}