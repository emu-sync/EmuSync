import { AgentStatusAlert } from "@/renderer/components/harnesses/AgentStatusHarness";
import Section from "@/renderer/components/Section";
import SectionTitle from "@/renderer/components/SectionTitle";
import { agentStatusAtom } from "@/renderer/state/agent-status";
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { useAtom } from "jotai";


export default function ApiStatus() {

    const [agentStatus] = useAtom(agentStatusAtom);

    return <Section>

        <SectionTitle
            title="EmuSync agent status"
            icon={<MonitorHeartIcon />}
        />
        <AgentStatusAlert
            running={agentStatus.isRunning}
        />
    </Section>
}
