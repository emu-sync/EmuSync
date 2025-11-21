import { SyncSource } from "@/renderer/types";
import { atom } from 'jotai';

export const defaultSyncSource: SyncSource = {
    id: "",
    name: "",
    storageProviderId: null,
    platformId: 0,
    autoSyncFrequencyMins: null
};

export const localSyncSourceAtom = atom<SyncSource>(defaultSyncSource);