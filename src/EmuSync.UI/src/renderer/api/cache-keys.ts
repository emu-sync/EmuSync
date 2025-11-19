export const cacheKeys = {
    localSyncSource: "localSyncSource",
    allSyncSources: "allSyncSources",

    game: (id: string) => {
        return buildCacheKey("game", id);
    },

    gameSyncStatus: (id: string) => {
        return buildCacheKey("gameSyncStatus", id);
    },
    gameList: "gameList",
    healthCheck: "healthCheck",
    latestRelease: "latestRelease",
    agentSystemInfo: "agentSystemInfo",
    changeLog: "changeLog",
}

export function buildCacheKey(key: string, additionalPart: string) {
    return `${key}-${additionalPart}`;
}