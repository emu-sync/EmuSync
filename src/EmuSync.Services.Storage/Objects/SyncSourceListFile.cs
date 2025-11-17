using EmuSync.Domain.Entities;
using EmuSync.Domain.Enums;
using System.Text.Json.Serialization;

namespace EmuSync.Services.Storage.Objects;

public record SyncSourceListFile
{
    [JsonPropertyName("sources")]
    public List<SyncSource> Sources { get; set; }
}

public record SyncSource
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("storageProvider")]
    public StorageProvider? StorageProvider { get; set; }

    [JsonPropertyName("osPlatform")]
    public OsPlatform OsPlatform { get; set; }

    public SyncSourceEntity ToEntity()
    {
        return new()
        {
            Id = this.Id,
            Name = this.Name,
            OsPlatform = this.OsPlatform,
            StorageProvider = this.StorageProvider
        };
    }

    public static SyncSource FromEntity(SyncSourceEntity entity)
    {
        return new()
        {
            Id = entity.Id,
            Name = entity.Name,
            OsPlatform = entity.OsPlatform,
            StorageProvider = entity.StorageProvider
        };
    }
}