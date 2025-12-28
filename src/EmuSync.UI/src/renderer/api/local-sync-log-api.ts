import { get } from "@/renderer/api/api-helper";
import { LocalSyncLog } from "@/renderer/types/LocalSyncLog";

const controller = "LocalSyncLog"

export async function getAllLocalSyncLogs(): Promise<LocalSyncLog[]> {

    const path = `${controller}`;

    return await get({
        path
    });

}

export async function getLocalSyncLogsForGame(gameId: string): Promise<LocalSyncLog[]> {

    const path = `${controller}/Game/${gameId}`;

    return await get({
        path
    });

}