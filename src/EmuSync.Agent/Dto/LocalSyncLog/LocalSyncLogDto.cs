using EmuSync.Domain.Enums;
using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.LocalSyncLog;

public record LocalSyncLogDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("gameId")]
    public string GameId { get; set; }

    [JsonPropertyName("isAutoSync")]
    public bool IsAutoSync { get; set; }

    [JsonPropertyName("syncTimeUtc")]
    public DateTime SyncTimeUtc { get; set; }

    [JsonPropertyName("syncType")]
    public SyncType SyncType { get; set; }
}