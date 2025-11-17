export interface GameSyncStatus {
    lastSyncedFrom?: string | null;
    lastSyncedAtUtc?: Date | null;
    latestWriteTimeUtc?: Date | null;
    localLatestWriteTimeUtc?: Date | null;
    requiresUpload: boolean;
    requiresDownload: boolean;
    localFolderPathIsUnset: boolean;
    localFolderPathExists: boolean;
    storageBytes: number;
}