using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.Game;

public record SyncSourceSummaryDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("storageProviderId")]
    public int? StorageProviderId { get; set; }

    [JsonPropertyName("platformId")]
    public int PlatformId { get; set; }
}