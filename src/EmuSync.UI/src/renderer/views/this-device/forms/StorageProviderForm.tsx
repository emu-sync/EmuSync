import { cacheKeys } from "@/renderer/api/cache-keys";
import { getLocalSyncSource } from "@/renderer/api/sync-source-api";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { CircularProgress, Typography } from "@mui/material";
import { useCallback } from "react";

import LoadingHarness from "@/renderer/components/harnesses/LoadingHarness";
import SectionTitle from "@/renderer/components/SectionTitle";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import DisplayExistingStorageProvider from "@/renderer/views/this-device/components/DisplayExistingStorageProviderSelector";
import StorageProviderSelector from "@/renderer/views/this-device/components/StorageProviderSelector";
import BackupIcon from '@mui/icons-material/Backup';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Section from "@/renderer/components/Section";

export default function StorageProviderForm() {

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [cacheKeys.localSyncSource],
        queryFn: getLocalSyncSource
    });

    const handleConnectedProvider = useCallback(() => {

        [cacheKeys.localSyncSource, cacheKeys.allSyncSources].forEach(key => {
            queryClient.invalidateQueries({ queryKey: [key] });
        });

        query.refetch();

    }, []);

    return <Section>

        <SectionTitle
            title="Storage provider"
            icon={<BackupIcon />}
        />

        <LoadingHarness
            query={query}
            loadingState={
                <LoadingState />
            }
        >

            {
                //has storage provider?
                query.data && query.data.storageProviderId ?
                    <DisplayExistingStorageProvider
                        provider={query.data.storageProviderId}
                    />
                    :
                    <StorageProviderSelector
                        onConnected={handleConnectedProvider}
                    />
            }

        </LoadingHarness>

    </Section>
}


function LoadingState() {
    return <HorizontalStack>
        <Typography>
            Loading provider details...
        </Typography>
        <CircularProgress size={16} />
    </HorizontalStack>
}