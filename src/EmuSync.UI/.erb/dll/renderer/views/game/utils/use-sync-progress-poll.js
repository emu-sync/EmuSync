"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useSyncProgressPoll;
const cache_keys_1 = require("@/renderer/api/cache-keys");
const game_sync_api_1 = require("@/renderer/api/game-sync-api");
const use_edit_query_1 = __importDefault(require("@/renderer/hooks/use-edit-query"));
const react_1 = require("react");
function useSyncProgressPoll(gameId) {
    const { query } = (0, use_edit_query_1.default)({
        queryFn: () => (0, game_sync_api_1.getSyncProgress)(gameId),
        queryKey: [cache_keys_1.cacheKeys.gameSyncProgres],
        relatedQueryKeys: [cache_keys_1.cacheKeys.gameSyncProgres],
        mutationFn: async () => { },
        disableAlerts: true
    });
    const isInProgress = query.data?.inProgress ?? false;
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            query.refetch();
        }, 200);
        return () => clearInterval(interval);
    }, []);
    return {
        isInProgress,
        currentStage: query.data?.currentStage ?? "",
        overallCompletionPercent: query.data?.overallCompletionPercent ?? 0
    };
}
//# sourceMappingURL=use-sync-progress-poll.js.map