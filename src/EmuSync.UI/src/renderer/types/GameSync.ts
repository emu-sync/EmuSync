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

export interface SyncProgress {
    inProgress: boolean;
    overallCompletionPercent: number | null;
    currentStage: string | null;
}