using EmuSync.Domain.Enums;

namespace EmuSync.Domain.Entities;

public class LocalSyncLogEntity
{
    public string Id { get; set; }

    /// <summary>
    /// The <see cref="GameEntity.Id"/>
    /// </summary>
    public string GameId { get; set; }

    /// <summary>
    /// True when the sync was done by auto sync
    /// </summary>
    public bool IsAutoSync { get; set; }

    /// <summary>
    /// When the sync occurred
    /// </summary>
    public DateTime SyncTimeUtc { get; set; }

    /// <summary>
    /// Upload/download
    /// </summary>
    public SyncType SyncType { get; set; }
}