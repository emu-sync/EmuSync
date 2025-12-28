import { GameSyncStatus } from "@/renderer/types/enums";

export interface GameSummary {
    id: string;
    name: string;
    autoSync: boolean;
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
    syncSourceIdLocations?: Record<string, string> | null;
    lastSyncedFrom?: string | null;
    lastSyncTimeUtc?: Date | null;
    storageBytes: number;
}

export interface CreateGame {
    name: string;
    autoSync: boolean;
    syncSourceIdLocations?: Record<string, string> | null;
}

export interface UpdateGame {
    id: string;
    name: string;
    autoSync: boolean;
    syncSourceIdLocations?: Record<string, string> | null;
}

export interface GameBackupManifest {
    id: string;
    backupFileName: string;
    createdOnUtc: string;
}