using EmuSync.Domain.Enums;

namespace EmuSync.Domain.Entities;

/// <summary>
/// A device or computer
/// </summary>
public class SyncSourceEntity
{
    public string Id { get; set; }

    public string Name { get; set; }

    /// <summary>
    /// The selected storage provider
    /// </summary>
    public StorageProvider? StorageProvider { get; set; }

    public OsPlatform OsPlatform { get; set; }

    public TimeSpan? AutoSyncFrequency { get; set; }
}
