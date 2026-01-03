import { get, postWithNoResponse } from "@/renderer/api/api-helper";
import { GameSyncStatus, SyncProgress  } from "@/renderer/types";

const controller = "GameSync"

export async function getGameSyncStatus(id: string): Promise<GameSyncStatus> {

    const path = `${controller}/${id}`;

    return await get({
        path
    });
}

export async function syncGame(id: string): Promise<void> {

    const path = `${controller}/${id}`;

    await postWithNoResponse({
        path
    });

}

export async function forceDownloadGame(id: string): Promise<void> {

    const path = `${controller}/${id}/ForceDownload`;

    await postWithNoResponse({
        path
    });

}

export async function forceUploadGame(id: string): Promise<void> {

    const path = `${controller}/${id}/ForceUpload`;

    await postWithNoResponse({
        path
    });

}

export async function restoreGameFromBackup(id: string, backupId: string): Promise<void> {

    const path = `${controller}/${id}/RestoreFromBackup/${backupId}`;

    await postWithNoResponse({
        path
    });

}

export async function getSyncProgress(id: string): Promise<SyncProgress> {

    const path = `${controller}/${id}/SyncProgress`;

    return await get({
        path
    });

}