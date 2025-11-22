import { cacheKeys } from "@/renderer/api/cache-keys";
import { deleteSyncSource, getSyncSourceList } from "@/renderer/api/sync-source-api";
import AgentStatusHarness from "@/renderer/components/harnesses/AgentStatusHarness";
import WarningAlert from "@/renderer/components/alerts/WarningAlert";
import Container from "@/renderer/components/Container";
import SectionTitle from "@/renderer/components/SectionTitle";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import useListQuery from "@/renderer/hooks/use-list-query";
import { routes } from "@/renderer/routes";
import { agentStatusAtom } from "@/renderer/state/agent-status";
import { localSyncSourceAtom } from "@/renderer/state/local-sync-source";
import DeviceList from "@/renderer/views/all-devices/components/DeviceList";
import { Typography } from "@mui/material";

import { useAtom } from "jotai";
import { useCallback } from "react";
import { Link } from "react-router-dom";


const Icon = routes.allDevices.icon;

export default function AllDevicesListScreen() {

    const [localSyncSource] = useAtom(localSyncSourceAtom);
    const [agentStatus] = useAtom(agentStatusAtom);

    const {
        query, deleteMutation
    } = useListQuery({
        queryFn: getSyncSourceList,
        queryKey: [cacheKeys.allSyncSources],
        relatedQueryKeys: [cacheKeys.allSyncSources, cacheKeys.localSyncSource],
        mutationFn: deleteSyncSource
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
            <AgentStatusHarness
                agentStatus={agentStatus}
            >

                {
                    localSyncSource.storageProviderId ?
                        <DeviceList
                            thisDeviceId={localSyncSource.id}
                            query={query}
                            onDelete={handleDelete}
                        />
                        :

                        <WarningAlert

                            content={
                                <Typography>
                                    You need to configure a storage provider in the <Link to={routes.thisDevice.href}>{routes.thisDevice.title}</Link> section before you can manage devices.
                                </Typography>
                            }
                        />
                }
            </AgentStatusHarness>
        </VerticalStack>
    </Container>
}
