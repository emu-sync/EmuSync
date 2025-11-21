using System.Text.Json.Serialization;

namespace EmuSync.Agent.Dto.SyncSource;

public record SyncSourceDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("storageProviderId")]
    public int? StorageProviderId { get; set; }

    [JsonPropertyName("platformId")]
    public int PlatformId { get; set; }

    [JsonPropertyName("autoSyncFrequencyMins")]
    public int? AutoSyncFrequencyMins { get; set; }
}
