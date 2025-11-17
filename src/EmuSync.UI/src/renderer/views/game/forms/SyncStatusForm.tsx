import { cacheKeys } from "@/renderer/api/cache-keys";
import { forceDownloadGame, forceUploadGame, getGameSyncStatus, syncGame } from "@/renderer/api/game-sync-api";
import ErrorAlert from "@/renderer/components/alerts/ErrorAlert";
import ButtonRow from "@/renderer/components/buttons/ButtonRow";
import LoadingHarness from "@/renderer/components/LoadingHarness";
import SectionTitle from "@/renderer/components/SectionTitle";
import AlertSkeleton from "@/renderer/components/skeleton/AlertSkeleton";
import ButtonSkeleton from "@/renderer/components/skeleton/ButtonSkeleton";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import useAlerts from "@/renderer/hooks/use-alerts";
import useEditQuery from "@/renderer/hooks/use-edit-query";
import DisplayGameSyncStatus from "@/renderer/views/game/components/DisplayGameSyncStatus";
import { determineGameSyncStatus } from "@/renderer/views/game/utils/game-utils";
import SyncIcon from '@mui/icons-material/Sync';
import { Button, Divider, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";


interface SyncStatusFormProps {
    gameId: string;
    gameName: string;
};

export default function SyncStatusForm({
    gameId, gameName
}: SyncStatusFormProps) {

    const { successAlert, errorAlert } = useAlerts();
    const queryClient = useQueryClient();

    const gameSyncStatusKey = useMemo(() => {
        return cacheKeys.gameSyncStatus(gameId);
    }, [gameId]);

    const {
        query, updateMutation
    } = useEditQuery({
        queryFn: () => getGameSyncStatus(gameId),
        queryKey: [gameSyncStatusKey],
        relatedQueryKeys: [gameSyncStatusKey],
        mutationFn: syncGame,
        successMessage: () => `Successfully synced game: ${gameName}`,
        errorMessage: () => `Failed to synced game: ${gameName}`,
    });

    const forceDownloadMutation = useMutation({
        mutationFn: forceDownloadGame,
        onSuccess: async (data) => {

            queryClient.invalidateQueries({ queryKey: [gameSyncStatusKey] });
            successAlert(`Successfully downloaded game files for: ${gameName}`);
        },
        onError: async () => {
            errorAlert(`Failed to download game files for: ${gameName} (do you have the game open?)`);
        },
    });

    const forceUploadMutation = useMutation({
        mutationFn: forceUploadGame,
        onSuccess: async (data) => {

            queryClient.invalidateQueries({ queryKey: [gameSyncStatusKey] });
            successAlert(`Successfully uploaded game files for: ${gameName}`);
        },
        onError: async () => {
            errorAlert(`Failed to upload game files for: ${gameName} (do you have the game open?)`);
        },
    });

    const handleSyncButtonClick = useCallback(() => {
        updateMutation.mutate(gameId);
    }, [gameId]);

    const syncState = useMemo(() => {

        if (query.data) {
            return determineGameSyncStatus(query.data);
        }

        return null;

    }, [query.data]);

    return <VerticalStack>
        <SectionTitle
            title="Sync status"
            icon={<SyncIcon />}
        />
        <LoadingHarness
            query={query}
            loadingState={
                <LoadingState />
            }
        >
            {
                query.data ?
                    <VerticalStack>
                        <DisplayGameSyncStatus
                            gameSyncStatus={query.data}
                        />
                        <ButtonRow>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSyncButtonClick}
                                disabled={
                                    query.isFetching || updateMutation.isPending || forceDownloadMutation.isPending || forceUploadMutation.isPending
                                    || syncState === null || syncState.isUpToDate || syncState.localPathIsUnset || (syncState.neverSynced && !syncState.localPathExists)
                                }
                                loading={updateMutation.isPending}
                            >
                                Sync Now
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => query.refetch()}
                                disabled={query.isFetching || updateMutation.isPending || forceDownloadMutation.isPending}
                                loading={query.isRefetching}
                            >
                                Recheck
                            </Button>
                        </ButtonRow>

                        {
                            syncState?.requiresDownload === true && syncState.localPathExists &&
                            <>
                                <Divider />
                                <ErrorAlert
                                    action={
                                        <Button
                                            color="error"
                                            variant="contained"

                                            size="small"
                                            disabled={query.isFetching || updateMutation.isPending || forceUploadMutation.isPending}
                                            loading={forceUploadMutation.isPending}
                                        >
                                            Upload
                                        </Button>

                                    }
                                    content={
                                        <VerticalStack>
                                            <Typography>
                                                If you know that the files on this device are newer, you can upload them instead.
                                            </Typography>

                                            <Typography>
                                                Only use this option if you're absolutely sure!
                                            </Typography>
                                        </VerticalStack>
                                    }
                                />
                            </>
                        }

                        {
                            syncState?.requiresUpload === true && !syncState.neverSynced &&
                            <>
                                <Divider />
                                <ErrorAlert
                                    action={
                                        <Button
                                            color="error"
                                            variant="contained"

                                            size="small"
                                            onClick={() => forceDownloadMutation.mutate(gameId)}
                                            disabled={query.isFetching || updateMutation.isPending || forceDownloadMutation.isPending}
                                            loading={forceDownloadMutation.isPending}
                                        >
                                            Download
                                        </Button>

                                    }
                                    content={
                                        <VerticalStack>
                                            <Typography>
                                                If you know that the files on this device are older, you can download them instead.
                                            </Typography>

                                            <Typography>
                                                Only use this option if you're absolutely sure!
                                            </Typography>
                                        </VerticalStack>
                                    }
                                />
                            </>
                        }
                    </VerticalStack>
                    :
                    <></>
            }
        </LoadingHarness>
    </VerticalStack>
}


function LoadingState() {

    return <VerticalStack>
        <AlertSkeleton />

        <ButtonRow>
            <ButtonSkeleton
                width={100}
            />

            <ButtonSkeleton
                width={91}
            />
        </ButtonRow>
    </VerticalStack>
}