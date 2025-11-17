"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameListScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const game_api_1 = require("@/renderer/api/game-api");
const AgentStatusHarness_1 = __importDefault(require("@/renderer/components/AgentStatusHarness"));
const InfoAlert_1 = __importDefault(require("@/renderer/components/alerts/InfoAlert"));
const WarningAlert_1 = __importDefault(require("@/renderer/components/alerts/WarningAlert"));
const ListViewDataGrid_1 = __importDefault(require("@/renderer/components/datagrid/ListViewDataGrid"));
const use_list_query_1 = __importDefault(require("@/renderer/hooks/use-list-query"));
const routes_1 = require("@/renderer/routes");
const agent_status_1 = require("@/renderer/state/agent-status");
const local_sync_source_1 = require("@/renderer/state/local-sync-source");
const material_1 = require("@mui/material");
const jotai_1 = require("jotai");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const columns = [
    { field: "id", headerName: "ID", flex: 1, type: "string", minWidth: 300 },
    { field: "name", headerName: "Name", flex: 10, type: "string", minWidth: 300 },
];
function GameListScreen() {
    const [localSyncSource] = (0, jotai_1.useAtom)(local_sync_source_1.localSyncSourceAtom);
    const [agentStatus] = (0, jotai_1.useAtom)(agent_status_1.agentStatusAtom);
    const { query, deleteMutation } = (0, use_list_query_1.default)({
        queryFn: game_api_1.getGameList,
        queryKey: [cache_keys_1.cacheKeys.gameList],
        relatedQueryKeys: [cache_keys_1.cacheKeys.gameList],
        mutationFn: game_api_1.deleteGame
    });
    const handleDelete = (0, react_1.useCallback)((id) => {
        return deleteMutation.mutateAsync(id);
    }, [deleteMutation]);
    const getDeleteItemDeails = (0, react_1.useCallback)(async (row) => {
        const details = {
            id: row.id,
            nameIdentifier: row.name,
            additionalDetailsComponent: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(InfoAlert_1.default, { content: "Please note: This doesn't delete any local save files for the game." }), (0, jsx_runtime_1.jsx)(material_1.Divider, {})] })
        };
        return details;
    }, []);
    return (0, jsx_runtime_1.jsx)(AgentStatusHarness_1.default, { agentStatus: agentStatus, children: localSyncSource.storageProviderId ?
            (0, jsx_runtime_1.jsx)(ListViewDataGrid_1.default, { columns: columns, rows: query.data ?? [], loading: query.isFetching, editHref: routes_1.routes.gameEdit.href, addButtonItemName: "game", addButtonRedirect: routes_1.routes.gameAdd.href, reloadFunc: query.refetch, deleteFunc: handleDelete, getDeleteItemDetails: getDeleteItemDeails })
            :
                (0, jsx_runtime_1.jsx)(WarningAlert_1.default, { content: (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["You need to configure a storage provider in the ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: routes_1.routes.thisDevice.href, children: routes_1.routes.thisDevice.title }), " section before you can manage games."] }) }) });
}
//# sourceMappingURL=GameListScreen.js.map