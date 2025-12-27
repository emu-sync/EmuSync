import { cacheKeys } from "@/renderer/api/cache-keys";
import { deleteSyncSource, getSyncSourceList } from "@/renderer/api/sync-source-api";
import Container from "@/renderer/components/Container";
import AgentStatusHarness from "@/renderer/components/harnesses/AgentStatusHarness";
import SectionTitle from "@/renderer/components/SectionTitle";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import useListQuery from "@/renderer/hooks/use-list-query";
import { routes } from "@/renderer/routes";
import { localSyncSourceAtom } from "@/renderer/state/local-sync-source";
import DeviceList from "@/renderer/views/all-devices/components/DeviceList";

import { useAtom } from "jotai";
import { useCallback } from "react";


const Icon = routes.allDevices.icon;

export default function AllDevicesListScreen() {

    const [localSyncSource] = useAtom(localSyncSourceAtom);

    const {
        query, deleteMutation
    } = useListQuery({
        queryFn: getSyncSourceList,
        queryKey: [cacheKeys.allSyncSources],
        relatedQueryKeys: [cacheKeys.allSyncSources, cacheKeys.localSyncSource],
        mutationFn: deleteSyncSource,
        resetCacheFn: async () => {}
    });

    const handleDelete = useCallback((id: string) => {
        return deleteMutation.mutateAsync(id);
    }, [deleteMutation]);


    return <Container>
        <VerticalStack>
            <SectionTitle
                title={routes.allDevices.title}
                icon={<Icon />}

            />
            <AgentStatusHarness >
                <DeviceList
                    thisDeviceId={localSyncSource.id}
                    query={query}
                    onDelete={handleDelete}
                />
            </AgentStatusHarness>
        </VerticalStack>
    </Container>
}
