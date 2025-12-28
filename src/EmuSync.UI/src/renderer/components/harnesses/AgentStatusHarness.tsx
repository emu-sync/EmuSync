import ErrorAlert from "@/renderer/components/alerts/ErrorAlert";
import SuccessAlert from "@/renderer/components/alerts/SuccessAlert";
import WarningAlert from "@/renderer/components/alerts/WarningAlert";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import { routes } from "@/renderer/routes";
import { agentStatusAtom } from "@/renderer/state/agent-status";
import { localSyncSourceAtom } from "@/renderer/state/local-sync-source";
import { CircularProgress, Typography } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";
import { Link } from "react-router-dom";

interface AgentStatusHarnessProps {
    children: React.ReactNode;
}

export default function AgentStatusHarness({
    children
}: AgentStatusHarnessProps) {

    const [agentStatus] = useAtom(agentStatusAtom);
    const [localSyncSource] = useAtom(localSyncSourceAtom);

    if (!agentStatus.hasChecked) {
        return <AgentStatusLoadingState />
    }

    if (!agentStatus.isRunning) {
        return <AgentStatusAlert
            running={false}
        />
    }

    if (!(localSyncSource.storageProviderId)) {
        return <WarningAlert

            content={
                <Typography>
                    You need to configure a storage provider in the <Link to={routes.thisDevice.href}>{routes.thisDevice.title}</Link> section first.
                </Typography>
            }
        />
    }
    
    return children;
}


export function AgentStatusLoadingState() {
    return <HorizontalStack>
        <Typography>
            Checking agent status...
        </Typography>
        <CircularProgress size={16} />
    </HorizontalStack>
}

interface AgentStatusAlertProps {
    running: boolean;
}

export function AgentStatusAlert({
    running
}: AgentStatusAlertProps) {

    if (!running) {
        return <ErrorAlert
            content="The EmuSync agent is not running on this device."
        />
    }

    return <SuccessAlert
        content="The EmuSync agent is running on this device."
    />

}