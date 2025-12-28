using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.SyncSource;

public record GameScanDetailsDto
{
    [JsonPropertyName("lastScanSeconds")]
    public double LastScanSeconds { get; set; }

    [JsonPropertyName("inProgress")]
    public bool InProgress { get; set; }

    [JsonPropertyName("progressPercent")]
    public double ProgressPercent { get; set; }

    [JsonPropertyName("countOfGames")]
    public int CountOfGames { get; set; }
}
