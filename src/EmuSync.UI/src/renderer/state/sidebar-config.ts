import { atom } from 'jotai';

export interface SidebarConfig {
    isMinimised: boolean;
}

const defaultSidebarConfig: SidebarConfig = {
    isMinimised: false
};

export const sidebarConfigAtom = atom<SidebarConfig>(defaultSidebarConfig);