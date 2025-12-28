import { SyncType } from "@/renderer/types/enums";

export interface LocalSyncLog {
    id: string;
    gameId: string;
    isAutoSync: boolean;
    syncTimeUtc: string;
    syncType: SyncType;
}
