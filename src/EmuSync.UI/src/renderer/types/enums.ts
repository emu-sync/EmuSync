export enum StorageProvider {
    GoogleDrive = 1,
    Dropbox = 2,
    OneDrive = 3,
}

export enum OsPlatform {
    Unknown = 0,
    Windows = 1,
    Linux = 2,
    Mac = 3
}

export enum GameSyncStatus {
    Unknown = 0,
    RequiresDownload = 1,
    RequiresUpload = 2,
    InSync = 3,
    UnsetDirectory = 4,
}

export const gameSyncStatusOptions = [
  { value: GameSyncStatus.Unknown, label: "Unknown" },
  { value: GameSyncStatus.RequiresDownload, label: "Requires download" },
  { value: GameSyncStatus.RequiresUpload, label: "Requires upload" },
  { value: GameSyncStatus.InSync, label: "In sync" },
  { value: GameSyncStatus.UnsetDirectory, label: "Unset directory" },
];