import BaseAlert from "@/renderer/components/alerts/BaseAlert";
import { AlertProps } from "@mui/material";
import React from "react";

type PickedProps = Omit<AlertProps, "severity" | "content">;

interface ErrorAlertProps extends PickedProps {
    content: string | React.ReactNode;
}

export default function ErrorAlert({
    content, ...alertProps
}: ErrorAlertProps) {

    return <BaseAlert
        severity="error"
        content={content}
        {...alertProps}
    />
}