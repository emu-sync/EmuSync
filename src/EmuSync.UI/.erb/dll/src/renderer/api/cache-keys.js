"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheKeys = void 0;
exports.buildCacheKey = buildCacheKey;
exports.cacheKeys = {
    localSyncSource: "localSyncSource",
    allSyncSources: "allSyncSources",
    game: (id) => {
        return buildCacheKey("game", id);
    },
    gameSyncStatus: (id) => {
        return buildCacheKey("gameSyncStatus", id);
    },
    gameList: "gameList",
    healthCheck: "healthCheck",
    agentSystemInfo: "agentSystemInfo",
};
function buildCacheKey(key, additionalPart) {
    return `${key}-${additionalPart}`;
}
//# sourceMappingURL=cache-keys.js.map