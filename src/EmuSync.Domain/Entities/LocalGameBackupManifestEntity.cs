namespace EmuSync.Domain.Entities;

public class LocalGameBackupManifestEntity
{
    /// <summary>
    /// A unique ID for the backup
    /// </summary>
    public string Id { get; set; }

    /// <summary>
    /// The <see cref="GameEntity.Id"/>
    /// </summary>
    public string GameId { get; set; }

    /// <summary>
    /// The name of the backup file
    /// </summary>
    public string BackupFileName { get; set; }

    /// <summary>
    /// The UTC DateTime the backup was created on
    /// </summary>
    public DateTime CreatedOnUtc { get; set; }
}
