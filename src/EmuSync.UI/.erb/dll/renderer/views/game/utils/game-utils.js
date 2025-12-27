"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCreateGame = exports.defaultUpdateGame = void 0;
exports.transformUpdateGame = transformUpdateGame;
exports.transformCreateGame = transformCreateGame;
exports.determineGameSyncStatus = determineGameSyncStatus;
exports.replacePathDelims = replacePathDelims;
const enums_1 = require("@/renderer/types/enums");
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
function replacePathDelims(syncSources, game) {
    if (!game.syncSourceIdLocations)
        return game;
    const updated = {};
    for (const [id, path] of Object.entries(game.syncSourceIdLocations)) {
        const syncSource = syncSources.find(s => s.id === id);
        if (!syncSource || !path) {
            continue;
        }
        const isWindows = syncSource.platformId === enums_1.OsPlatform.Windows;
        updated[id] = isWindows
            ? path.replace(/\//g, "\\") //normalise → Windows
            : path.replace(/\\/g, "/"); //normalise → mac + linux
    }
    return {
        ...game,
        syncSourceIdLocations: updated
    };
}
//# sourceMappingURL=game-utils.js.map