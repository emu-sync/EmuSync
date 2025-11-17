import { OsPlatform } from "@/renderer/types/enums";

export interface SyncSource {
    id: string;
    name: string;
    storageProviderId?: number | null;
    platformId: OsPlatform;
}

export interface SyncSourceSummary {
    id: string;
    name: string;
    storageProviderId?: number | null;
    platformId: OsPlatform;
}

export interface UpdateSyncSource {
    name: string;
}

export interface SetStorageProvider {
    storageProviderId: number;
}