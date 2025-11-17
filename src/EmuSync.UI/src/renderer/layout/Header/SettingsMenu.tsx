"use client";

import InfoAlert from "@/renderer/components/alerts/InfoAlert";
import { useReleaseVersionChecker } from "@/renderer/hooks/use-release-version-checker";
import ColourSchemeSelector from "@/renderer/layout/Header/ColourSchemeSelector";
import { routes } from "@/renderer/routes";
import { siteSettings } from "@/renderer/site-settings";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Badge, Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from "react";
import { Link } from "react-router-dom";


export default function SettingsMenu() {

    const {
        latestVersion,
        currentVersion,
        isNewVersion
    } = useReleaseVersionChecker();

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    return <Box>
        <IconButton
            onClick={handleOpenUserMenu}
            title="Open settings"
        >
            <Badge
                color="primary"
                variant="dot"
                badgeContent={true ? " " : ""}
            >
                <SettingsOutlinedIcon />
            </Badge>
        </IconButton>
        <Menu

            disableScrollLock={true}
            disablePortal={true}
            sx={{
                marginTop: `${siteSettings.layoutProperties.headerHeight - 20}px`
            }}
            anchorEl={anchorElUser}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            slotProps={{
                paper: {
                    elevation: 2,
                    sx: {
                        minWidth: 300,
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))'
                    },
                }
            }}
        >

            <Box sx={{ px: 1 }} >

                <MenuItem
                    sx={{
                        cursor: "default",
                        "&:hover": {
                            background: "none"
                        }
                    }}
                    disableTouchRipple
                >
                    <ColourSchemeSelector />
                </MenuItem>

                {
                    isNewVersion &&
                    <InfoAlert
                        sx={{
                            maxWidth: 275,
                            m: 1
                        }}
                        content={
                            <Typography>There is <Link onClick={handleCloseUserMenu} to={routes.about.href}>new version</Link> of EmuSync available!</Typography>
                        }
                    />
                }
            </Box>


        </Menu>
    </Box >
}