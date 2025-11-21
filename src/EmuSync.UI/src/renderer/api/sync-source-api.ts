import { get, postWithNoResponse, put, remove } from "@/renderer/api/api-helper";
import { NextAutoSyncTime, ScanDetails, SetStorageProvider, SyncSource, SyncSourceSummary, UpdateSyncSource } from "@/renderer/types";

const controller = "SyncSource"

export async function getSyncSourceList(): Promise<SyncSourceSummary[]> {

    const path = `${controller}`;

    return await get({
        path
    });

}

export async function getLocalSyncSource(): Promise<SyncSource> {

    const path = `${controller}/Local`;

    return await get({
        path
    });

}

export async function getNextAutoSyncTime(): Promise<NextAutoSyncTime> {

    const path = `${controller}/NextAutoSyncTime`;

    return await get({
        path
    });

}

export async function getGameScanDetails(): Promise<ScanDetails> {

    const path = `${controller}/GameScanDetails`;

    return await get({
        path
    });

}

export async function forceGameScan(): Promise<void> {

    const path = `${controller}/ForceGameScan`;

    return await postWithNoResponse({
        path
    });

}

export async function updateLocalSyncSource(body: UpdateSyncSource): Promise<void> {

    const path = `${controller}/Local`;

    await put({
        path,
        body
    });

}

export async function setLocalStorageProvider(body: SetStorageProvider): Promise<void> {

    const path = `${controller}/Local/StorageProvider`;

    await postWithNoResponse({
        path,
        body
    });

}

export async function unlinkStorageProvider(force: boolean): Promise<void> {

    const path = `${controller}/Local/StorageProvider`;

    const query = {
        force
    };

    await remove({
        path,
        query
    });

}


export async function deleteSyncSource(id: string): Promise<void> {

    const path = `${controller}/${id}`;

    await remove({
        path
    });

}