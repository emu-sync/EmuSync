import { SyncSource, SyncSourceSummary } from "@/renderer/types";
import { atom } from 'jotai';

const defaultSyncSources: SyncSourceSummary[] = [];

export const allSyncSourcesAtom = atom<SyncSourceSummary[]>(defaultSyncSources);