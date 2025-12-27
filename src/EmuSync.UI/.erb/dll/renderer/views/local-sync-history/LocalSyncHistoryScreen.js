"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocalSyncHistoryScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const game_api_1 = require("@/renderer/api/game-api");
const local_sync_log_api_1 = require("@/renderer/api/local-sync-log-api");
const AgentStatusHarness_1 = __importDefault(require("@/renderer/components/harnesses/AgentStatusHarness"));
const LocalSyncLogDataGrid_1 = __importDefault(require("@/renderer/components/datagrid/LocalSyncLogDataGrid"));
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
function LocalSyncHistoryScreen() {
    const query = (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.gameLocalSyncLogsList],
        queryFn: local_sync_log_api_1.getAllLocalSyncLogs
    });
    const gamesQuery = (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.gameList],
        queryFn: game_api_1.getGameList
    });
    //only show logs where the game exists
    const logsWithValidGames = (0, react_1.useMemo)(() => {
        if (query.data && gamesQuery.data) {
            const gameSet = new Set(gamesQuery.data.map(x => x.id));
            return query.data.filter(x => gameSet.has(x.gameId));
        }
        return [];
    }, [query.data, gamesQuery.data]);
    return (0, jsx_runtime_1.jsx)(AgentStatusHarness_1.default, { children: (0, jsx_runtime_1.jsx)(LocalSyncLogDataGrid_1.default, { loading: query.isLoading || gamesQuery.isLoading, hasError: query.isError, reloadFunc: query.refetch, games: gamesQuery.data ?? [], logs: logsWithValidGames, showToolbar: true, showGameColumn: true }) });
}
//# sourceMappingURL=LocalSyncHistoryScreen.js.map