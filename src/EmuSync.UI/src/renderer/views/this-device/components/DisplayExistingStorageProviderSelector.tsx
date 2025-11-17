import { StorageProvider } from "@/renderer/types/enums";
import { Button, Paper, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";

import { cacheKeys } from "@/renderer/api/cache-keys";
import { unlinkStorageProvider } from "@/renderer/api/sync-source-api";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import useAlerts from "@/renderer/hooks/use-alerts";
import StorageProviderDetails from "@/renderer/views/this-device/components/StorageProviderDetails";
import { storageProviderMap } from "@/renderer/views/this-device/utils/sync-source-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorAlert from "@/renderer/components/alerts/ErrorAlert";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";


interface DisplayExistingStorageProviderProps {
    provider: StorageProvider;
}

export default function DisplayExistingStorageProvider({
    provider
}: DisplayExistingStorageProviderProps) {

    const providerDetails = useMemo(() => {
        return storageProviderMap[provider];
    }, [provider]);

    const { successAlert, errorAlert } = useAlerts();
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: unlinkStorageProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [cacheKeys.localSyncSource] });
            successAlert("Successfully unlinked provider");
        },
        onError: () => {
            errorAlert("Failed to unlink provider");
        },
    });

    const handleMutation = useCallback(() => {
        updateMutation.mutate(false);
    }, [updateMutation]);

    const handleMutationForce = useCallback(() => {
        updateMutation.mutate(true);
    }, [updateMutation]);

    const isMutating = updateMutation.isPending;

    return <VerticalStack>
        <Paper
            elevation={3}
            sx={{
                p: 2
            }}
            component={HorizontalStack}
            justifyContent="space-between"
        >

            <StorageProviderDetails
                image={providerDetails.image}
                name={providerDetails.name}
                justifyContent="start"
            />

            <Button
                color="error"
                variant="contained"
                disabled={isMutating}
                loading={isMutating}
                title="Unlink this device from the provider"
                onClick={handleMutation}
            >
                Unlink
            </Button>
        </Paper>

        {
            updateMutation.isError &&

            <ErrorAlert
                action={
                    <Button
                        onClick={handleMutationForce}
                        title="Force unlink this device from the provider"
                        color="error"
                        disabled={isMutating}
                        loading={isMutating}
                        size="small"
                        sx={{
                            minWidth: 120
                        }}
                    >
                        Force unlink
                    </Button>

                }
                content={
                    <VerticalStack>
                        <Typography>
                            There may be an issue with the credentials stored on this device for your storage provider.
                            You can force unlink it here.
                        </Typography>

                        <Typography>
                            I recommend that you force unlink the provider, link to it again, then try unlinking normally again to property clear this device from the storage provider.
                        </Typography>
                    </VerticalStack>
                }
            />
        }
    </VerticalStack>
}