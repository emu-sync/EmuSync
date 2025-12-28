namespace EmuSync.Domain;

public class DomainConstants
{
    // LOCAL DATA
    public const string LocalDataFolder = ".emusync-data";

    public const string LocalDataGameBackupFolder = "game-backups";
    public const string LocalDataGameBackupFileNameFormat = "backup_{0}.zip";
    public const string LocalDataGameBackupManifestFile = "manifest.json";

    public const string LocalDataSyncSourceFile = "sync-source.json";
    public const string LocalDataSyncLogFile = "local-sync-log.log";

    public const string LocalDataLudusaviLastEtagFile = "ludusavi-last-etag.json";
    public const string LocalDataLudusaviManifestFile = "ludusavi-manifest.json";
    public const string LocalDataLudusaviCachedScanFile = "ludusavi-cached-scan.json";

    public const int DefaultMaximumLocalGameBackups = 10;
}