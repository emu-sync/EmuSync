"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocalSyncLogForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const local_sync_log_api_1 = require("@/renderer/api/local-sync-log-api");
const InfoAlert_1 = __importDefault(require("@/renderer/components/alerts/InfoAlert"));
const LoadingHarness_1 = __importDefault(require("@/renderer/components/harnesses/LoadingHarness"));
const LocalSyncLogDataGrid_1 = __importDefault(require("@/renderer/components/datagrid/LocalSyncLogDataGrid"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const AlertSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/AlertSkeleton"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const routes_1 = require("@/renderer/routes");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const Icon = routes_1.routes.localSyncHistory.icon;
;
function LocalSyncLogForm({ gameId }) {
    const gameLocalSyncLogsKey = (0, react_1.useMemo)(() => {
        return cache_keys_1.cacheKeys.gameLocalSyncLogs(gameId);
    }, [gameId]);
    const query = (0, react_query_1.useQuery)({
        queryKey: [gameLocalSyncLogsKey],
        queryFn: () => (0, local_sync_log_api_1.getLocalSyncLogsForGame)(gameId)
    });
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "Local sync history", icon: (0, jsx_runtime_1.jsx)(Icon, {}) }), (0, jsx_runtime_1.jsx)(LoadingHarness_1.default, { query: query, loadingState: (0, jsx_runtime_1.jsx)(LoadingState, {}), children: query.data && query.data.length > 0 ?
                    (0, jsx_runtime_1.jsx)("div", { style: {
                            display: "flex",
                            flexDirection: "column",
                            maxHeight: 500,
                        }, children: (0, jsx_runtime_1.jsx)(LocalSyncLogDataGrid_1.default, { logs: query.data, games: [], showGameColumn: false, showToolbar: false, loading: false, hasError: false, reloadFunc: async () => { } }) })
                    :
                        (0, jsx_runtime_1.jsx)(InfoAlert_1.default, { content: "No local sync logs are available for this game. This may be because the game has never been synced on this device, or because all previous logs have been removed due to log storage limits." }) })] });
}
function LoadingState() {
    return (0, jsx_runtime_1.jsx)(VerticalStack_1.default, { children: (0, jsx_runtime_1.jsx)(AlertSkeleton_1.default, {}) });
}
//# sourceMappingURL=LocalSyncLogForm.js.map