"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCreateGame = exports.defaultUpdateGame = void 0;
exports.transformUpdateGame = transformUpdateGame;
exports.transformCreateGame = transformCreateGame;
exports.determineGameSyncStatus = determineGameSyncStatus;
exports.defaultUpdateGame = {
    id: "",
    name: "",
    autoSync: false,
    syncSourceIdLocations: null
};
exports.defaultCreateGame = {
    name: "",
    autoSync: false,
    syncSourceIdLocations: null
};
function transformUpdateGame(game) {
    return {
        id: game.id,
        autoSync: game.autoSync,
        syncSourceIdLocations: game.syncSourceIdLocations,
        name: game.name
    };
}
function transformCreateGame() {
    return { ...exports.defaultCreateGame };
}
function determineGameSyncStatus(gameSyncStatus) {
    const neverSynced = !(gameSyncStatus.lastSyncedFrom);
    const { requiresDownload, requiresUpload } = gameSyncStatus;
    const isUpToDate = !neverSynced && !requiresDownload && !requiresUpload;
    const localPathIsUnset = gameSyncStatus.localFolderPathIsUnset;
    const localPathExists = gameSyncStatus.localFolderPathExists;
    return {
        neverSynced,
        requiresDownload,
        requiresUpload,
        isUpToDate,
        localPathIsUnset,
        localPathExists
    };
}
//# sourceMappingURL=game-utils.js.map