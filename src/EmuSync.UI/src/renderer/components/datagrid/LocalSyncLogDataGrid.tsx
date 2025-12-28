import { SyncTypeChip } from "@/renderer/components/chips/SyncTypeChip";
import CustomToolbar from "@/renderer/components/datagrid/CustomToolbar";
import DisplayDate from "@/renderer/components/dates/DisplayDate";
import { routes } from "@/renderer/routes";
import { Game } from "@/renderer/types";
import { syncTypeOptions } from "@/renderer/types/enums";
import { LocalSyncLog } from "@/renderer/types/LocalSyncLog";
import { DataGrid, GridColDef, GridRow, GridRowProps } from "@mui/x-data-grid";
import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

interface LocalSyncLogDataGridProps {
    loading: boolean;
    hasError: boolean;
    reloadFunc: () => Promise<any>;
    logs: LocalSyncLog[];
    games: Game[];
    showGameColumn: boolean;
    showToolbar: boolean;
    disableSelection: boolean;
}

export default function LocalSyncLogDataGrid({
    loading, hasError,
    reloadFunc,
    logs, games, showGameColumn, showToolbar,
    disableSelection
}: LocalSyncLogDataGridProps) {


    const columns: GridColDef<LocalSyncLog>[] = useMemo(() => {

        const gameColumn: GridColDef<LocalSyncLog>[] = showGameColumn ? [
            {
                field: "gameId", headerName: "Game", flex: 5, minWidth: 250, headerAlign: "left", align: "left",
                type: "singleSelect",
                valueOptions: games.map(g => ({ value: g.id, label: g.name })),
            }
        ] : [];

        const output: GridColDef<LocalSyncLog>[] = [
            {
                field: "syncType", headerName: "Sync type", flex: 1, minWidth: 140, headerAlign: "center", align: "center",
                type: "singleSelect",
                valueOptions: syncTypeOptions,
                renderCell: (params) => {
                    return <SyncTypeChip
                        syncType={params.row.syncType}
                        sx={{
                            minWidth: 130
                        }}
                    />
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

                    return <DisplayDate
                        date={date}
                        displayAsFromNow
                    />
                }
            }
        ];

        return output;

    }, [games, showGameColumn, showGameColumn]);
    
    const LinkRow = (props: GridRowProps) => {

        const href = `${routes.gameEdit.href}?id=${props.row.gameId}`;

        return <Link
            to={href}
            style={{ color: "inherit", textDecoration: "none" }}
        >
            <GridRow {...props} />
        </Link>
    }


    const Toolbar = useCallback(() => {
        return <CustomToolbar
            loading={loading}
            hasError={hasError}
            reloadFunc={reloadFunc}
        />

    }, [loading, hasError, reloadFunc]);

    return <DataGrid
        columns={columns}
        rows={logs}
        loading={loading}
        showToolbar={showToolbar}

        disableRowSelectionOnClick
        getRowClassName={() => disableSelection ? "disabled-row" : ""}

        slots={{
            toolbar: Toolbar as never,
            row: disableSelection ? undefined : LinkRow
        }}
    />
}