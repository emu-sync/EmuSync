"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSyncSourceList = getSyncSourceList;
exports.getLocalSyncSource = getLocalSyncSource;
exports.updateLocalSyncSource = updateLocalSyncSource;
exports.setLocalStorageProvider = setLocalStorageProvider;
exports.unlinkStorageProvider = unlinkStorageProvider;
exports.deleteSyncSource = deleteSyncSource;
const api_helper_1 = require("@/renderer/api/api-helper");
const controller = "SyncSource";
async function getSyncSourceList() {
    const path = `${controller}`;
    return await (0, api_helper_1.get)({
        path
    });
}
async function getLocalSyncSource() {
    const path = `${controller}/Local`;
    return await (0, api_helper_1.get)({
        path
    });
}
async function updateLocalSyncSource(body) {
    const path = `${controller}/Local`;
    await (0, api_helper_1.put)({
        path,
        body
    });
}
async function setLocalStorageProvider(body) {
    const path = `${controller}/Local/StorageProvider`;
    await (0, api_helper_1.postWithNoResponse)({
        path,
        body
    });
}
async function unlinkStorageProvider(force) {
    const path = `${controller}/Local/StorageProvider`;
    const query = {
        force
    };
    await (0, api_helper_1.remove)({
        path,
        query
    });
}
async function deleteSyncSource(id) {
    const path = `${controller}/${id}`;
    await (0, api_helper_1.remove)({
        path
    });
}
//# sourceMappingURL=sync-source-api.js.map