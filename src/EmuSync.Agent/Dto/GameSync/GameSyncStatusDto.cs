using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.GameSync;

public record GameSyncStatusDto
{
    [JsonPropertyName("lastSyncedFrom")]
    public string? LastSyncedFrom { get; set; }

    [JsonPropertyName("lastSyncedAtUtc")]
    public DateTime? LastSyncedAtUtc { get; set; }

    [JsonPropertyName("latestWriteTimeUtc")]
    public DateTime? LatestWriteTimeUtc { get; set; }

    [JsonPropertyName("localLatestWriteTimeUtc")]
    public DateTime? LocalLatestWriteTimeUtc { get; set; }

    [JsonPropertyName("requiresUpload")]
    public bool RequiresUpload { get; set; }

    [JsonPropertyName("requiresDownload")]
    public bool RequiresDownload { get; set; }

    [JsonPropertyName("localFolderPathIsUnset")]
    public bool LocalFolderPathIsUnset { get; set; }

    [JsonPropertyName("localFolderPathExists")]
    public bool LocalFolderPathExists { get; set; }

    [JsonPropertyName("storageBytes")]
    public long? StorageBytes { get; set; }
}