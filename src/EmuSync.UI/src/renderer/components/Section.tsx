import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { Paper } from "@mui/material";
import React from "react";

interface SectionProps {
    children: React.ReactNode;
}

export default function Section({
    children
}: SectionProps) {
    return <Paper
        elevation={2}
        sx={{
            p: 2
        }}
    >
        <VerticalStack>
            {children}
        </VerticalStack>
    </Paper>
}