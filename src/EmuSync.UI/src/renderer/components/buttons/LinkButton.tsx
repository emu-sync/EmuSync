import { Button, ButtonOwnProps, ButtonProps, SxProps } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

interface LinkButtonProps {
    href: string;
    title: string;
    disabled?: boolean;
    buttonSx?: SxProps;
    buttonStartIcon?: React.ReactNode;
    buttonSize?: ButtonProps["size"];
    children: React.ReactNode;
    variant?: ButtonOwnProps["variant"];
}

export default function LinkButton({
    href, title, disabled, buttonSx, buttonStartIcon, buttonSize, variant,
    children
}: LinkButtonProps) {

    return <Link
        to={href}
        title={title}
        style={{ color: "inherit", textDecoration: "none", pointerEvents: disabled ? "none" : "unset" }}
    >
        <Button
            variant={variant ?? "text"}
            startIcon={buttonStartIcon}
            sx={buttonSx}
            disabled={disabled}
            size={buttonSize}
        >
            {children}
        </Button>
    </Link>
}