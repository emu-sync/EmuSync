import { cacheKeys } from "@/renderer/api/cache-keys";
import { getGameBackups } from "@/renderer/api/game-api";
import { forceDownloadGame, forceUploadGame, getGameSyncStatus, restoreGameFromBackup, syncGame } from "@/renderer/api/game-sync-api";
import ErrorAlert from "@/renderer/components/alerts/ErrorAlert";
import WarningAlert from "@/renderer/components/alerts/WarningAlert";
import ButtonRow from "@/renderer/components/buttons/ButtonRow";
import LoadingHarness from "@/renderer/components/harnesses/LoadingHarness";
import { Pre } from "@/renderer/components/Pre";
import Section from "@/renderer/components/Section";
import SectionTitle from "@/renderer/components/SectionTitle";
import AlertSkeleton from "@/renderer/components/skeleton/AlertSkeleton";
import ButtonSkeleton from "@/renderer/components/skeleton/ButtonSkeleton";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import useAlerts from "@/renderer/hooks/use-alerts";
import useEditQuery from "@/renderer/hooks/use-edit-query";
import DisplayGameSyncStatus from "@/renderer/views/game/components/DisplayGameSyncStatus";
import RestoreFromBackupModal from "@/renderer/views/game/components/RestoreFromBackupModal";
import { determineGameSyncStatus } from "@/renderer/views/game/utils/game-utils";
import SyncIcon from '@mui/icons-material/Sync';
import { Button, Divider, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";


interface SyncStatusFormProps {
    gameId: string;
    gameName: string;
};

export default function SyncStatusForm({
    gameId, gameName
}: SyncStatusFormProps) {


    const [backupModalIsOpen, setBackupModalIsOpen] = useState(false);

    const { successAlert, errorAlert } = useAlerts();
    const queryClient = useQueryClient();

    const gameLocalSyncLogsKey = useMemo(() => {
        return cacheKeys.gameLocalSyncLogs(gameId);
    }, [gameId]);

    const gameSyncStatusKey = useMemo(() => {
        return cacheKeys.gameSyncStatus(gameId);
    }, [gameId]);

    const gameBackupsKey = useMemo(() => {
        return cacheKeys.gameBackups(gameId);
    }, [gameId]);

    const {
        query, updateMutation
    } = useEditQuery({
        queryFn: () => getGameSyncStatus(gameId),
        queryKey: [gameSyncStatusKey],
        relatedQueryKeys: [gameSyncStatusKey, gameBackupsKey, cacheKeys.gameList, gameLocalSyncLogsKey],
        mutationFn: syncGame,
        successMessage: () => `Successfully synced game: ${gameName}`,
        errorMessage: () => `Failed to sync game: ${gameName}`,
    });

    const {
        query: gameBackupsQuery,
        updateMutation: restoreGameFromBackupMutation
    } = useEditQuery({
        queryFn: () => getGameBackups(gameId),
        queryKey: [gameBackupsKey],
        relatedQueryKeys: [gameBackupsKey, gameSyncStatusKey, cacheKeys.gameList, gameLocalSyncLogsKey],
        mutationFn: async (backupId, context) => {
            return restoreGameFromBackup(gameId, backupId as string);
        },
        successMessage: () => `Successfully restored backup for game: ${gameName}`,
        errorMessage: () => `Failed to restore backup for game: ${gameName}`,
    });

    const forceDownloadMutation = useMutation({
        mutationFn: forceDownloadGame,
        onSuccess: async (data) => {

            queryClient.invalidateQueries({ queryKey: [gameSyncStatusKey] });
            queryClient.invalidateQueries({ queryKey: [gameBackupsKey] });
            queryClient.invalidateQueries({ queryKey: [gameLocalSyncLogsKey] });
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
            queryClient.invalidateQueries({ queryKey: [gameBackupsKey] });
            queryClient.invalidateQueries({ queryKey: [gameLocalSyncLogsKey] });
            successAlert(`Successfully uploaded game files for: ${gameName}`);
        },
        onError: async () => {
            errorAlert(`Failed to upload game files for: ${gameName} (do you have the game open?)`);
        },
    });

    const handleSyncButtonClick = useCallback(() => {
        updateMutation.mutate(gameId);
    }, [gameId]);

    const handleRestoreFromBackup = useCallback((backupId: string) => {
        restoreGameFromBackupMutation.mutate(backupId);
        setBackupModalIsOpen(false);
    }, []);

    const syncState = useMemo(() => {

        if (query.data) {
            return determineGameSyncStatus(query.data);
        }

        return null;

    }, [query.data]);

    const hasBackups = gameBackupsQuery.data && gameBackupsQuery.data.length > 0;

    return <Section>
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
                                    query.isFetching || restoreGameFromBackupMutation.isPending ||updateMutation.isPending || forceDownloadMutation.isPending || forceUploadMutation.isPending
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
                                disabled={query.isFetching || restoreGameFromBackupMutation.isPending ||updateMutation.isPending || forceDownloadMutation.isPending}
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
                                            disabled={query.isFetching || restoreGameFromBackupMutation.isPending ||updateMutation.isPending || forceUploadMutation.isPending}
                                            loading={forceUploadMutation.isPending}
                                            sx={{
                                                minWidth: 100
                                            }}
                                        >
                                            Upload
                                        </Button>

                                    }
                                    content={
                                        <VerticalStack gap={0.25}>
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
                                            disabled={query.isFetching || restoreGameFromBackupMutation.isPending || updateMutation.isPending || forceDownloadMutation.isPending || forceUploadMutation.isPending}
                                            sx={{
                                                minWidth: 100
                                            }}
                                        >
                                            Download
                                        </Button>

                                    }
                                    content={
                                        <VerticalStack gap={0.25}>
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
                        {
                            hasBackups &&
                            <>
                                <Divider />
                                <WarningAlert
                                    action={
                                        <Button
                                            color="warning"
                                            variant="contained"

                                            size="small"
                                            onClick={() => setBackupModalIsOpen(true)}
                                            disabled={query.isFetching || updateMutation.isPending || forceDownloadMutation.isPending}
                                            loading={restoreGameFromBackupMutation.isPending}
                                            sx={{
                                                ml: 1,
                                                minWidth: 150
                                            }}
                                        >
                                            Choose a backup
                                        </Button>

                                    }
                                    content={
                                        <VerticalStack>
                                            <Typography>
                                                This game has <Pre>{gameBackupsQuery.data.length}</Pre> local backup{gameBackupsQuery.data.length > 1 ? "s" : ""} you can restore from.
                                                Restoring from a backup will overwrite the local game save files, then upload them as the latest files.
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

            <RestoreFromBackupModal 
                backups={gameBackupsQuery.data ?? []}
                isOpen={backupModalIsOpen}
                setIsOpen={setBackupModalIsOpen}
                onSelectBackup={handleRestoreFromBackup}
            />
        </LoadingHarness>
    </Section>
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