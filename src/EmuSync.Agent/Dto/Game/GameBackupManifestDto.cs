using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.Game;

public record GameBackupManifestDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("backupFileName")]
    public string BackupFileName { get; set; }

    [JsonPropertyName("createdOnUtc")]
    public DateTime CreatedOnUtc { get; set; }
}
