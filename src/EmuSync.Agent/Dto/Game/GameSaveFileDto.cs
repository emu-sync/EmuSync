using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.Game;

public record GameSaveFileDto
{
    [JsonPropertyName("relativePath")]
    public string RelativePath { get; set; }

    [JsonPropertyName("sizeBytes")]
    public long SizeBytes { get; set; }

    [JsonPropertyName("lastWriteTimeUtc")]
    public DateTime LastWriteTimeUtc { get; set; }
}
