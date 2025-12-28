"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LocalSyncLogDataGrid;
const jsx_runtime_1 = require("react/jsx-runtime");
const SyncTypeChip_1 = require("@/renderer/components/chips/SyncTypeChip");
const CustomToolbar_1 = __importDefault(require("@/renderer/components/datagrid/CustomToolbar"));
const DisplayDate_1 = __importDefault(require("@/renderer/components/dates/DisplayDate"));
const routes_1 = require("@/renderer/routes");
const enums_1 = require("@/renderer/types/enums");
const x_data_grid_1 = require("@mui/x-data-grid");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
function LocalSyncLogDataGrid({ loading, hasError, reloadFunc, logs, games, showGameColumn, showToolbar, disableSelection }) {
    const columns = (0, react_1.useMemo)(() => {
        const gameColumn = showGameColumn ? [
            {
                field: "gameId", headerName: "Game", flex: 5, minWidth: 250, headerAlign: "left", align: "left",
                type: "singleSelect",
                valueOptions: games.map(g => ({ value: g.id, label: g.name })),
            }
        ] : [];
        const output = [
            {
                field: "syncType", headerName: "Sync type", flex: 1, minWidth: 140, headerAlign: "center", align: "center",
                type: "singleSelect",
                valueOptions: enums_1.syncTypeOptions,
                renderCell: (params) => {
                    return (0, jsx_runtime_1.jsx)(SyncTypeChip_1.SyncTypeChip, { syncType: params.row.syncType, sx: {
                            minWidth: 130
                        } });
                }
            },
            ...gameColumn,
            {
                field: "isAutoSync", headerName: "Synced automatically?", flex: 1, type: "boolean", minWidth: 150, headerAlign: "center", align: "center",
            },
            {
                field: "syncTimeUtc", headerName: "Sync time", flex: 1, minWidth: 150, headerAlign: "center", align: "center",
                type: "date",
                valueGetter: (value) => {
                    return new Date(value);
                },
                renderCell: (params) => {
                    const date = new Date(params.row.syncTimeUtc);
                    return (0, jsx_runtime_1.jsx)(DisplayDate_1.default, { date: date, displayAsFromNow: true });
                }
            }
        ];
        return output;
    }, [games, showGameColumn, showGameColumn]);
    const LinkRow = (props) => {
        const href = `${routes_1.routes.gameEdit.href}?id=${props.row.gameId}`;
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: href, style: { color: "inherit", textDecoration: "none" }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.GridRow, { ...props }) });
    };
    const Toolbar = (0, react_1.useCallback)(() => {
        return (0, jsx_runtime_1.jsx)(CustomToolbar_1.default, { loading: loading, hasError: hasError, reloadFunc: reloadFunc });
    }, [loading, hasError, reloadFunc]);
    return (0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { columns: columns, rows: logs, loading: loading, showToolbar: showToolbar, disableRowSelectionOnClick: true, getRowClassName: () => disableSelection ? "disabled-row" : "", slots: {
            toolbar: Toolbar,
            row: disableSelection ? undefined : LinkRow
        } });
}
//# sourceMappingURL=LocalSyncLogDataGrid.js.map