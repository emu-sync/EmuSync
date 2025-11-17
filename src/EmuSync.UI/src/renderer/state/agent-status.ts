import { atom } from 'jotai';


export interface AgentStatus {
    isRunning: boolean;
    hasChecked: boolean;
}

const defaultAgentStatus: AgentStatus = {
    isRunning: false,
    hasChecked: false
};

export const agentStatusAtom = atom<AgentStatus>(defaultAgentStatus);