import AgentStatusHarness, { AgentStatusAlert } from "@/renderer/components/harnesses/AgentStatusHarness";
import SectionTitle from "@/renderer/components/SectionTitle";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { agentStatusAtom } from "@/renderer/state/agent-status";
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { useAtom } from "jotai";


export default function ApiStatus() {

    const [agentStatus] = useAtom(agentStatusAtom);

    return <VerticalStack>

        <SectionTitle
            title="EmuSync agent status"
            icon={<MonitorHeartIcon />}
        />
        <AgentStatusAlert
            running={agentStatus.isRunning}
        />
    </VerticalStack>
}
