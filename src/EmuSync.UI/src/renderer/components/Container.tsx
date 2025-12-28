import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import React from "react";

interface ContainerProps {
    children: React.ReactNode;
}

export default function Container({
    children
}: ContainerProps) {
    return <VerticalStack
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
            }         
        }}
    >
        {children}
    </VerticalStack>
}