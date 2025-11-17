namespace EmuSync.Domain.Entities;

public class GameEntity
{
    public string Id { get; set; }

    public string Name { get; set; }

    /// <summary>
    /// When true, the agent will automatically keep the files in sync
    /// </summary>
    public bool AutoSync { get; set; }

    /// <summary>
    /// The sync sources associated with this game and the location
    /// </summary>
    public Dictionary<string, string>? SyncSourceIdLocations { get; set; }

    /// <summary>
    /// Id of the last sync source
    /// </summary>
    public string? LastSyncedFrom { get; set; }

    /// <summary>
    /// When the last sync happened
    /// </summary>
    public DateTime? LastSyncTimeUtc { get; set; }

    /// <summary>
    /// The latest write time of the file or directory from the last sync - used to determine if a new sync is needed
    /// </summary>
    public DateTime? LatestWriteTimeUtc { get; set; }

    /// <summary>
    /// The amount of bytes the files take up
    /// </summary>
    public long StorageBytes { get; set; }
}
