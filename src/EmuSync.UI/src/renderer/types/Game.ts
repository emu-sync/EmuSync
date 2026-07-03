import { GameSyncStatus } from "@/renderer/types/enums";

export interface GameSummary {
    id: string;
    name: string;
    autoSync: boolean;
    maximumLocalGameBackups: number | null;
    syncSourceIdLocations?: Record<string, string> | null;
    lastSyncedFrom?: string | null;
    lastSyncTimeUtc?: Date | null;
    syncStatusId: GameSyncStatus;
    storageBytes: number;
}

export interface GameSuggestion {
    name: string;
    suggestedFolderPaths: string[];
}

export interface Game {
    id: string;
    name: string;
    autoSync: boolean;
    maximumLocalGameBackups: number | null;
    syncSourceIdLocations?: Record<string, string> | null;
    lastSyncedFrom?: string | null;
    lastSyncTimeUtc?: Date | null;
    storageBytes: number;
    ignoredFilePaths?: string[] | null;
}

export interface CreateGame {
    name: string;
    autoSync: boolean;
    syncSourceIdLocations?: Record<string, string> | null;
    maximumLocalGameBackups: number | null;
    ignoredFilePaths?: string[] | null;
}

export interface UpdateGame {
    id: string;
    name: string;
    autoSync: boolean;
    syncSourceIdLocations?: Record<string, string> | null;
    maximumLocalGameBackups: number | null;
    ignoredFilePaths?: string[] | null;
}

export interface GameSaveFile {
    relativePath: string;
    sizeBytes: number;
    lastWriteTimeUtc: Date;
}

export interface GameBackupManifest {
    id: string;
    backupFileName: string;
    createdOnUtc: string;
}

export interface QuickAddRequestBody {
    games: QuickAddGame[];
}

export interface QuickAddGame {
    existingGameId: string | null;
    path: string;
    gameName: string | null;
    autoSync: boolean;
    maximumLocalGameBackups: number | null;
}