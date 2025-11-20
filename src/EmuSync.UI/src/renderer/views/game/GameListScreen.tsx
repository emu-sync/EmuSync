import { cacheKeys } from "@/renderer/api/cache-keys";
import { deleteGame, getGameList } from "@/renderer/api/game-api";
import AgentStatusHarness from "@/renderer/components/AgentStatusHarness";
import InfoAlert from "@/renderer/components/alerts/InfoAlert";
import WarningAlert from "@/renderer/components/alerts/WarningAlert";
import ListViewDataGrid from "@/renderer/components/datagrid/ListViewDataGrid";
import { DeleteItemDetails } from "@/renderer/components/modals/DeleteModal";
import useListQuery from "@/renderer/hooks/use-list-query";
import { routes } from "@/renderer/routes";
import { agentStatusAtom } from "@/renderer/state/agent-status";
import { localSyncSourceAtom } from "@/renderer/state/local-sync-source";
import { GameSummary } from "@/renderer/types";
import { Chip, Divider, Typography } from "@mui/material";

import { GridColDef } from '@mui/x-data-grid';
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { GameSyncStatusChip } from "@/renderer/components/chips/GameSyncStatusChip";
import { gameSyncStatusOptions } from "@/renderer/types/enums";
import { allSyncSourcesAtom } from "@/renderer/state/all-sync-sources";
import DisplayDate from "@/renderer/components/DisplayDate";
import { size } from "lodash";


export default function GameListScreen() {

    const [localSyncSource] = useAtom(localSyncSourceAtom);
    const [allSyncSources] = useAtom(allSyncSourcesAtom);
    const [agentStatus] = useAtom(agentStatusAtom);

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
            { field: "name", headerName: "Name", flex: 10, type: "string", minWidth: 250 },
            {
                field: "autoSync", headerName: "Auto sync", flex: 1, type: "boolean", minWidth: 100, headerAlign: "center", align: "center",

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
                        return <Chip
                            label="Never"
                            color="error"
                            size="small"
                            sx={{
                                minWidth: 100
                            }}
                        />
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
        query, deleteMutation
    } = useListQuery({
        queryFn: async () => getGameList(),
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

    return <AgentStatusHarness
        agentStatus={agentStatus}
    >

        {
            localSyncSource.storageProviderId ?
                <ListViewDataGrid
                    columns={columns}
                    rows={query.data ?? []}
                    loading={query.isFetching}

                    editHref={routes.gameEdit.href}

                    addButtonItemName="game"
                    addButtonRedirect={routes.gameAdd.href}

                    hasError={query.isError}
                    reloadFunc={query.refetch}

                    deleteFunc={handleDelete}
                    getDeleteItemDetails={getDeleteItemDeails}
                />
                :

                <WarningAlert

                    content={
                        <Typography>
                            You need to configure a storage provider in the <Link to={routes.thisDevice.href}>{routes.thisDevice.title}</Link> section before you can manage games.
                        </Typography>
                    }
                />
        }
    </AgentStatusHarness>
}
