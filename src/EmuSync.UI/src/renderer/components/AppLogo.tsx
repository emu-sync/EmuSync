import { Box, Paper, useColorScheme } from "@mui/material";
import React from "react";



import darklogo from "@assets/images/emusync-logo-dark.png";
import lightlogo from "@assets/images/emusync-logo-light.png";

export default function AppLogo() {

    const { mode, systemMode } = useColorScheme();
    const logo = mode === "dark" || systemMode === "dark" ? darklogo : lightlogo;

    return <img
        src={logo}
        alt="EmuSync logo"
        style={{
            height: "100%",
            width: "auto",
            padding: "0.65rem"
        }}
    />
}