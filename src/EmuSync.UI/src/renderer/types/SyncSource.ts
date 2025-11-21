import { OsPlatform } from "@/renderer/types/enums";

export interface SyncSource {
    id: string;
    name: string;
    storageProviderId?: number | null;
    platformId: OsPlatform;
    autoSyncFrequencyMins: number | null;
}

export interface SyncSourceSummary {
    id: string;
    name: string;
    storageProviderId?: number | null;
    platformId: OsPlatform;
}

export interface UpdateSyncSource {
    name: string;
    autoSyncFrequencyMins: number | null;
}

export interface SetStorageProvider {
    storageProviderId: number;
}

export interface NextAutoSyncTime {
  secondsLeft: number;
}

export interface ScanDetails {
    lastScanSeconds: number;
    inProgress: boolean;
    progressPercent: number;
}