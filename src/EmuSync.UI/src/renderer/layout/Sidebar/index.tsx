"use client";


import SidebarContent from "@/renderer/layout/Sidebar/SidebarContent";
import { siteSettings } from "@/renderer/site-settings";
import { sidebarConfigAtom } from "@/renderer/state/sidebar-config";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { Box, Button, Drawer, Paper, Stack, SxProps, Typography, useColorScheme } from '@mui/material';
import { useAtom } from "jotai";


const { sidebarTransitionTime, sidebarWidth, sidebarMinimisedWidth, headerHeight } = siteSettings.layoutProperties;

interface SidebarProps {
    mobileDrawerOpen: boolean;
    mobileDrawerToggle: (forceState?: boolean) => void;
}

export default function Sidebar({
    mobileDrawerOpen, mobileDrawerToggle
}: SidebarProps) {

    const [sidebarConfig] = useAtom(sidebarConfigAtom);
    const sidebarIsMinimised = sidebarConfig.isMinimised;

    const minimiseButtonChevronStyles: SxProps = {
        color: "text.primary",
        ml: "auto",
        mr: 2
    };

    //apply styles to the "paper" part of the drawer so we can set colours
    const paperStyles = {
        '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarIsMinimised ? sidebarMinimisedWidth : sidebarWidth,
            transition: `width ${sidebarTransitionTime}`,
            border: "unset",
            borderRadius: 0
        },
    }

    const mobileDrawerStyles: SxProps = {
        display: {
            xs: 'block',
            md: 'none'
        },
        '& .MuiDrawer-paper': {
            ...paperStyles['& .MuiDrawer-paper'],
            width: sidebarWidth
        },
    };

    //don't show sidebar by default in desktop
    const desktopDrawerStyles: SxProps = {
        display: {
            xs: 'none',
            md: 'block'
        },
        ...paperStyles,
        '& .MuiDrawer-paper': {
            ...paperStyles['& .MuiDrawer-paper'],
            background: "none"
        },
    }

    return <>

        {/* MOBILE */}
        <Drawer
            variant="temporary"
            open={mobileDrawerOpen}
            onClose={() => mobileDrawerToggle()}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={mobileDrawerStyles}
            PaperProps={{
                elevation: 2
            }}
        >
            <SidebarContent
                mobileDrawerToggle={mobileDrawerToggle}
                sidebarMinimised={false}
            />
        </Drawer>

        {/* DESKTOP */}
        <Drawer
            variant="permanent"
            sx={desktopDrawerStyles}
            open

            PaperProps={{
                sx: {
                    zIndex: 500,
                    boxShadow: "none"
                },
                elevation: 1
            }}
        >
            <Stack
                sx={{
                    height: "100%",
                    paddingTop: `${siteSettings.layoutProperties.headerHeight + 10}px`
                }}
            >

                <SidebarContent
                    mobileDrawerToggle={mobileDrawerToggle}
                    sidebarMinimised={sidebarIsMinimised}
                />
            </Stack>
        </Drawer>
    </>
}