"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameSyncStatus = getGameSyncStatus;
exports.syncGame = syncGame;
exports.forceDownloadGame = forceDownloadGame;
exports.forceUploadGame = forceUploadGame;
exports.restoreGameFromBackup = restoreGameFromBackup;
const api_helper_1 = require("@/renderer/api/api-helper");
const controller = "GameSync";
async function getGameSyncStatus(id) {
    const path = `${controller}/${id}`;
    return await (0, api_helper_1.get)({
        path
    });
}
async function syncGame(id) {
    const path = `${controller}/${id}`;
    await (0, api_helper_1.postWithNoResponse)({
        path
    });
}
async function forceDownloadGame(id) {
    const path = `${controller}/${id}/ForceDownload`;
    await (0, api_helper_1.postWithNoResponse)({
        path
    });
}
async function forceUploadGame(id) {
    const path = `${controller}/${id}/ForceUpload`;
    await (0, api_helper_1.postWithNoResponse)({
        path
    });
}
async function restoreGameFromBackup(id, backupId) {
    const path = `${controller}/${id}/RestoreFromBackup/${backupId}`;
    await (0, api_helper_1.postWithNoResponse)({
        path
    });
}
//# sourceMappingURL=game-sync-api.js.map