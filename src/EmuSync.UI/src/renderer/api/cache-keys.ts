export const cacheKeys = {
    localSyncSource: "localSyncSource",
    allSyncSources: "allSyncSources",

    game: (id: string) => {
        return buildCacheKey("game", id);
    },

    gameSyncStatus: (id: string) => {
        return buildCacheKey("gameSyncStatus", id);
    },

    gameLocalSyncLogsList: "gameLocalSyncLogs",
    gameLocalSyncLogs: (id: string) => {
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
}

export function buildCacheKey(key: string, additionalPart: string) {
    return `${key}-${additionalPart}`;
}