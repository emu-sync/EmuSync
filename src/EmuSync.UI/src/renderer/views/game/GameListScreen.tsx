import { cacheKeys } from "@/renderer/api/cache-keys";
import { clearGameCache, deleteGame, getGameList } from "@/renderer/api/game-api";
import InfoAlert from "@/renderer/components/alerts/InfoAlert";
import ListViewDataGrid from "@/renderer/components/datagrid/ListViewDataGrid";
import AgentStatusHarness from "@/renderer/components/harnesses/AgentStatusHarness";
import { DeleteItemDetails } from "@/renderer/components/modals/DeleteModal";
import useListQuery from "@/renderer/hooks/use-list-query";
import { routes } from "@/renderer/routes";
import { GameSummary } from "@/renderer/types";
import { Divider } from "@mui/material";

import { GridColDef } from '@mui/x-data-grid';
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { GameSyncStatusChip } from "@/renderer/components/chips/GameSyncStatusChip";
import StorageSizeChip from "@/renderer/components/chips/StorageSizeChip";
import DisplayDate from "@/renderer/components/dates/DisplayDate";
import { allSyncSourcesAtom } from "@/renderer/state/all-sync-sources";
import { gameSyncStatusOptions } from "@/renderer/types/enums";


export default function GameListScreen() {

    const [allSyncSources] = useAtom(allSyncSourcesAtom);

    const columns: GridColDef<GameSummary>[] = useMemo(() => {

        return [
            {
                field: "syncStatusId", headerName: "Status", flex: 1, minWidth: 100, headerAlign: "center", align: "center",
                type: "singleSelect",
                valueOptions: gameSyncStatusOptions,
                renderCell: (params) => {
                    return <GameSyncStatusChip
                        status={params.row.syncStatusId}
                    />
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
                renderCell: (params,) => {

                    const { storageBytes } = params.row;

                    if (!storageBytes) {
                        return "";
                    }

                    return <StorageSizeChip
                        bytes={storageBytes}
                        size="small"
                        sx={{
                            minWidth: 100
                        }}
                    />
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
                    if (!value) return new Date();
                    return new Date(value);
                },
                renderCell: (params) => {

                    const value = params.row.lastSyncTimeUtc;

                    if (!value) {
                        return "";
                    }

                    return <DisplayDate
                        date={params.row.lastSyncTimeUtc}
                        displayAsFromNow
                    />
                }
            }
        ];
    }, [gameSyncStatusOptions, allSyncSources]);

    const {
        query, deleteMutation, resetCacheMutation
    } = useListQuery({
        queryFn: async () => getGameList(),
        resetCacheFn: clearGameCache,
        queryKey: [cacheKeys.gameList],
        relatedQueryKeys: [cacheKeys.gameList],
        mutationFn: deleteGame
    });

    const handleDelete = useCallback((id: string) => {
        return deleteMutation.mutateAsync(id);
    }, [deleteMutation]);

    const getDeleteItemDeails = useCallback(async (row: GameSummary) => {

        const details: DeleteItemDetails = {
            id: row.id,
            nameIdentifier: row.name,
            additionalDetailsComponent: <>
                <InfoAlert
                    content="Please note: This doesn't delete any local save files for the game."
                />
                <Divider />
            </>
        }

        return details;

    }, []);

    return <AgentStatusHarness>
        <ListViewDataGrid
            columns={columns}
            rows={query.data ?? []}
            loading={query.isFetching || resetCacheMutation.isPending}

            editHref={routes.gameEdit.href}

            addButtonItemName="game"
            addButtonRedirect={routes.gameAdd.href}

            hasError={query.isError}
            reloadFunc={async () => resetCacheMutation.mutateAsync(undefined)}

            deleteFunc={handleDelete}
            getDeleteItemDetails={getDeleteItemDeails}
        />
    </AgentStatusHarness>
}
