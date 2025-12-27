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
    gameLocalSyncLogsList: "gameLocalSyncLogs",
    gameLocalSyncLogs: (id) => {
        return buildCacheKey("gameLocalSyncLogs", id);
    },
    gameList: "gameList",
    gameSuggestionList: "gameSuggestionList",
    healthCheck: "healthCheck",
    latestRelease: "latestRelease",
    agentSystemInfo: "agentSystemInfo",
    changeLog: "changeLog",
    news: "news",
    nextAutoSyncTime: "nextAutoSyncTime",
    gameScanDetails: "gameScanDetails",
};
function buildCacheKey(key, additionalPart) {
    return `${key}-${additionalPart}`;
}
//# sourceMappingURL=cache-keys.js.map