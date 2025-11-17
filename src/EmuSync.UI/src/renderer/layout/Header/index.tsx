"use client";

import { AppBar, Box, IconButton, Toolbar } from '@mui/material';

import AppLogo from "@/renderer/components/AppLogo";
import SettingsMenu from "@/renderer/layout/Header/SettingsMenu";
import { siteSettings } from "@/renderer/site-settings";
import { sidebarConfigAtom } from "@/renderer/state/sidebar-config";
import MenuIcon from '@mui/icons-material/Menu';
import { useAtom } from "jotai";

const { sidebarTransitionTime, headerHeight, } = siteSettings.layoutProperties;

interface HeaderProps {
    mobileDrawerToggle: (forceState?: boolean) => void,
}

export default function Header({
    mobileDrawerToggle,
}: HeaderProps) {

    const [sidebarConfig, setSidebarConfig] = useAtom(sidebarConfigAtom);
    const sidebarIsMinimised = sidebarConfig.isMinimised;

    const handleSidebarMinimiseToggle = () => {
        setSidebarConfig(prev => {
            const clone = { ...prev };
            clone.isMinimised = !sidebarIsMinimised;
            return clone;
        });
    }

    return <>
        <AppBar
            position="sticky"
            color="transparent"
            sx={{
                border: "unset",
                boxShadow: "none",
                width: "100%",
                transition: `margin ${sidebarTransitionTime}, width ${sidebarTransitionTime}`,
            }}
        >

            <Toolbar
                sx={{
                    height: headerHeight,
                    minHeight: headerHeight,
                    color: "text.primary",
                    border: "unset",
                    pl: {
                        md: "0px!important"
                    },
                    background: "unset",
                }}
            >
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        title="Minimise sidebar"
                        sx={{
                            display: {
                                xs: "none",
                                md: "flex" //only show this button in desktop
                            },
                            ml: 1.5
                        }}
                        onClick={handleSidebarMinimiseToggle}
                    >
                        <MenuIcon />
                    </IconButton>

                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    title="Open drawer"
                    sx={{
                        display: {
                            md: "none" //only show this button in mobile
                        }
                    }}
                    onClick={() => mobileDrawerToggle()}
                >
                    <MenuIcon />
                </IconButton>

                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        justifySelf: "start",
                        mr: "auto",
                        p: 1,
                    }}
                >
                    <AppLogo />
                </Box>

                <SettingsMenu />

            </Toolbar>
        </AppBar>
    </>
}