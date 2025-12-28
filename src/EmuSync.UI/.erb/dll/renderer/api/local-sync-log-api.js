"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLocalSyncLogs = getAllLocalSyncLogs;
exports.getLocalSyncLogsForGame = getLocalSyncLogsForGame;
const api_helper_1 = require("@/renderer/api/api-helper");
const controller = "LocalSyncLog";
async function getAllLocalSyncLogs() {
    const path = `${controller}`;
    return await (0, api_helper_1.get)({
        path
    });
}
async function getLocalSyncLogsForGame(gameId) {
    const path = `${controller}/Game/${gameId}`;
    return await (0, api_helper_1.get)({
        path
    });
}
//# sourceMappingURL=local-sync-log-api.js.map