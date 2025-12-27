"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameListScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const game_api_1 = require("@/renderer/api/game-api");
const InfoAlert_1 = __importDefault(require("@/renderer/components/alerts/InfoAlert"));
const ListViewDataGrid_1 = __importDefault(require("@/renderer/components/datagrid/ListViewDataGrid"));
const AgentStatusHarness_1 = __importDefault(require("@/renderer/components/harnesses/AgentStatusHarness"));
const use_list_query_1 = __importDefault(require("@/renderer/hooks/use-list-query"));
const routes_1 = require("@/renderer/routes");
const material_1 = require("@mui/material");
const jotai_1 = require("jotai");
const react_1 = require("react");
const GameSyncStatusChip_1 = require("@/renderer/components/chips/GameSyncStatusChip");
const StorageSizeChip_1 = __importDefault(require("@/renderer/components/chips/StorageSizeChip"));
const DisplayDate_1 = __importDefault(require("@/renderer/components/dates/DisplayDate"));
const all_sync_sources_1 = require("@/renderer/state/all-sync-sources");
const enums_1 = require("@/renderer/types/enums");
function GameListScreen() {
    const [allSyncSources] = (0, jotai_1.useAtom)(all_sync_sources_1.allSyncSourcesAtom);
    const columns = (0, react_1.useMemo)(() => {
        return [
            {
                field: "syncStatusId", headerName: "Status", flex: 1, minWidth: 100, headerAlign: "center", align: "center",
                type: "singleSelect",
                valueOptions: enums_1.gameSyncStatusOptions,
                renderCell: (params) => {
                    return (0, jsx_runtime_1.jsx)(GameSyncStatusChip_1.GameSyncStatusChip, { status: params.row.syncStatusId });
                }
            },
            {
                field: "name", headerName: "Name", flex: 10, type: "string", minWidth: 250
            },
            {
                field: "autoSync", headerName: "Auto sync", flex: 1, type: "boolean", minWidth: 100, headerAlign: "center", align: "center",
            },
            {
                field: "storageBytes", headerName: "Size", flex: 1, type: "number", minWidth: 120, headerAlign: "center", align: "center",
                renderCell: (params) => {
                    const { storageBytes } = params.row;
                    if (!storageBytes) {
                        return "";
                    }
                    return (0, jsx_runtime_1.jsx)(StorageSizeChip_1.default, { bytes: storageBytes, size: "small", sx: {
                            minWidth: 100
                        } });
                }
            },
            {
                field: "lastSyncedFrom", headerName: "Last uploaded from", flex: 2, minWidth: 200, headerAlign: "center", align: "center",
                type: "singleSelect",
                valueOptions: allSyncSources.map(x => ({
                    value: x.id,
                    label: x.name
                })),
            },
            {
                field: "lastSyncTimeUtc", headerName: "Last uploaded", flex: 1, minWidth: 150, headerAlign: "center", align: "center",
                type: "date",
                valueGetter: (value) => {
                    if (!value)
                        return new Date();
                    return new Date(value);
                },
                renderCell: (params) => {
                    const value = params.row.lastSyncTimeUtc;
                    if (!value) {
                        return "";
                    }
                    return (0, jsx_runtime_1.jsx)(DisplayDate_1.default, { date: params.row.lastSyncTimeUtc, displayAsFromNow: true });
                }
            }
        ];
    }, [enums_1.gameSyncStatusOptions, allSyncSources]);
    const { query, deleteMutation, resetCacheMutation } = (0, use_list_query_1.default)({
        queryFn: async () => (0, game_api_1.getGameList)(),
        resetCacheFn: game_api_1.clearGameCache,
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
    return (0, jsx_runtime_1.jsx)(AgentStatusHarness_1.default, { children: (0, jsx_runtime_1.jsx)(ListViewDataGrid_1.default, { columns: columns, rows: query.data ?? [], loading: query.isFetching || resetCacheMutation.isPending, editHref: routes_1.routes.gameEdit.href, addButtonItemName: "game", addButtonRedirect: routes_1.routes.gameAdd.href, hasError: query.isError, reloadFunc: async () => resetCacheMutation.mutateAsync(undefined), deleteFunc: handleDelete, getDeleteItemDetails: getDeleteItemDeails }) });
}
//# sourceMappingURL=GameListScreen.js.map