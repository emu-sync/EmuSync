import { Box, Paper } from "@mui/material";
import React from "react";

interface ContainerProps {
    children: React.ReactNode;
}

export default function Container({
    children
}: ContainerProps) {
    return <Paper
        sx={{
            margin: "auto",
            maxWidth: {
                xs: "unset",
                lg: "50%"
            },
            minWidth: {
                xs: "100%",
                lg: 650,
                xl: 800,
            },
            p: 2            
        }}
        elevation={2}
    >
        {children}
    </Paper>
}