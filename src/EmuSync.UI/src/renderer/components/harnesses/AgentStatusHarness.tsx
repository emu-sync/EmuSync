import ErrorAlert from "@/renderer/components/alerts/ErrorAlert";
import SuccessAlert from "@/renderer/components/alerts/SuccessAlert";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import { AgentStatus } from "@/renderer/state/agent-status";
import { CircularProgress, Typography } from "@mui/material";
import React from "react";

interface AgentStatusHarnessProps {
    agentStatus: AgentStatus;
    children: React.ReactNode;
}

export default function AgentStatusHarness({
    agentStatus, children
}: AgentStatusHarnessProps) {

    if (!agentStatus.hasChecked) {
        return <AgentStatusLoadingState />
    }

    if (!agentStatus.isRunning) {
        return <AgentStatusAlert
            running={false}
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