import { Pre } from "@/renderer/components/Pre";
import { Button } from "@mui/material";
import React from "react";


interface ScrollLinkProps {
    children: React.ReactNode;
    scrollRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollLink({
    children, scrollRef
}: ScrollLinkProps) {

    const scrollTo = () => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    };

    return <Button
        sx={{
            p: 0,
            m: 0,
            minWidth: 0,
            width: "auto"
        }}
        onClick={scrollTo}
    >
        <Pre >
            {children}
        </Pre>
    </Button>
}