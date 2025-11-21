using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.SyncSource;

public class NextAutoSyncTimeDto
{
    [JsonPropertyName("secondsLeft")]
    public double SecondsLeft { get; set; }
}
