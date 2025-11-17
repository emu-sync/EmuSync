import BaseAlert from "@/renderer/components/alerts/BaseAlert";
import { AlertProps } from "@mui/material";
import React from "react";

type PickedProps = Omit<AlertProps, "severity" | "content">;

interface WarningAlertProps extends PickedProps {
    content: string | React.ReactNode;
}

export default function WarningAlert({
    content, ...alertProps
}: WarningAlertProps) {

    return <BaseAlert
        severity="warning"
        content={content}
        {...alertProps}
    />
}