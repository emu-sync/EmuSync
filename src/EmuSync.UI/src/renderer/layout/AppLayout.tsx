import Header from "@/renderer/layout/Header";
import Sidebar from "@/renderer/layout/Sidebar";
import { siteSettings } from "@/renderer/site-settings";
import { sidebarConfigAtom } from "@/renderer/state/sidebar-config";
import { Box, Paper } from "@mui/material";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface AppLayoutProps {
    children: React.ReactNode;
}

const { sidebarTransitionTime, sidebarWidth, sidebarMinimisedWidth } = siteSettings.layoutProperties;

export default function AppLayout({
    children
}: AppLayoutProps) {

    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [sidebarConfig] = useAtom(sidebarConfigAtom);
    const sidebarIsMinimised = sidebarConfig.isMinimised;

    const mainBoxStyles = {
        marginLeft: {
            xs: 0,
            md: sidebarIsMinimised ? sidebarMinimisedWidth : sidebarWidth
        },
        transition: `margin ${sidebarTransitionTime}`,
    };

    const handleMobileDrawerToggle = (forceState?: boolean) => {

        //sometimes we will always tell this function that it should be closed or open
        //this is fixing a bug where we were unintentionally setting it to open, which was causing the overflow to be hidden on pages that needed it
        if (typeof forceState === "boolean") {
            setMobileDrawerOpen(forceState);
            return;
        }

        setMobileDrawerOpen(!mobileDrawerOpen);
    }

    return <>
        <Header
            mobileDrawerToggle={handleMobileDrawerToggle}
        />
        <Sidebar
            mobileDrawerOpen={mobileDrawerOpen}
            mobileDrawerToggle={handleMobileDrawerToggle}
        />

        <Box sx={mainBoxStyles}>
            <Paper
                sx={{
                    p: 2,
                    mx: siteSettings.layoutProperties.mainPadding,
                    minHeight: 500,
                    height: `calc(100vh - ${siteSettings.layoutProperties.headerHeight}px - (${siteSettings.layoutProperties.mainPadding} * 1.5))`,
                    overflow: "auto"
                }}
                elevation={1}
            >
                {children}
            </Paper>
        </Box>
    </>
}