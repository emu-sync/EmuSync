using EmuSync.Domain.Entities;
using System.Text.Json.Serialization;

namespace EmuSync.Services.Storage.Objects;

public record GameMetaData
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("b")]
    public string Name { get; set; }

    [JsonPropertyName("as")]
    public bool AutoSync { get; set; }

    [JsonPropertyName("sl")]
    public Dictionary<string, string>? SyncSourceIdLocations { get; set; }

    [JsonPropertyName("lsf")]
    public string? LastSyncedFrom { get; set; }

    [JsonPropertyName("lst")]
    public DateTime? LastSyncTimeUtc { get; set; }

    [JsonPropertyName("lwt")]
    public DateTime? LatestWriteTimeUtc { get; set; }

    [JsonPropertyName("sb")]
    public long StorageBytes { get; set; }

    public GameEntity ToEntity()
    {
        return new()
        {
            Id = this.Id,
            Name = this.Name,
            AutoSync = this.AutoSync,
            LastSyncTimeUtc = this.LastSyncTimeUtc,
            LastSyncedFrom = this.LastSyncedFrom,
            LatestWriteTimeUtc = this.LatestWriteTimeUtc,
            SyncSourceIdLocations = this.SyncSourceIdLocations,
            StorageBytes = this.StorageBytes
        };
    }

    public static GameMetaData FromGame(GameEntity entity)
    {
        return new()
        {
            Id = entity.Id,
            Name = entity.Name,
            AutoSync = entity.AutoSync,
            SyncSourceIdLocations = entity.SyncSourceIdLocations,
            LastSyncTimeUtc = entity.LastSyncTimeUtc,
            LastSyncedFrom = entity.LastSyncedFrom,
            LatestWriteTimeUtc = entity.LatestWriteTimeUtc,
            StorageBytes = entity.StorageBytes
        };
    }
}