'use client';

import { sidebarConfigAtom } from "@/renderer/state/sidebar-config";
import { alpha, darken, lighten, ListItemButton, ListItemIcon, ListItemText, SxProps, useTheme } from "@mui/material";

import { CSSProperties } from "@mui/material/styles";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";

interface NavItemProps {
    href: string,
    linkText: string,
    showText: boolean,
    icon: React.ReactNode,
    onClick: () => void,
    selected: boolean
}

export default function NavItem({
    href, linkText, showText, icon, onClick, selected
}: NavItemProps) {

    const theme = useTheme();
    const textColour = "text.primary";

    const brightenedColour = lighten(theme.palette.primary.main, 0.3);

    const buttonStyles: SxProps = {
        pl: 1,
        py: 1.5,
        color: textColour,
        borderTopRightRadius: {
            xs: 0,
            md: 15
        },
        borderBottomRightRadius: {
            xs: 0,
            md: 15
        },
        borderLeft: `5px solid transparent`,
        "&.Mui-selected": {
            borderColor: "primary.main",
            color: "primary.main",
            backgroundColor: alpha(brightenedColour, 0.075)
        },
        height: 45,
        fontSize: "0.85rem"
    };

    const iconStyles: CSSProperties = {
        color: selected ? "primary.main" : textColour,
        ml: 1.5
    };

    //aligns the image to the center a bit beter
    if (!showText) {
        iconStyles.minWidth = 30;
    }

    return <Link
        to={href}
        onClick={onClick}
        style={{ textDecoration: "none" }}
        title={linkText}
    >
        <ListItemButton sx={buttonStyles} selected={selected}>

            <ListItemIcon sx={iconStyles} >
                {icon}
            </ListItemIcon>

            {
                showText &&
                <ListItemText sx={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", ml: "-10px" }} disableTypography>
                    {linkText}
                </ListItemText>
            }

        </ListItemButton>
    </Link>
}