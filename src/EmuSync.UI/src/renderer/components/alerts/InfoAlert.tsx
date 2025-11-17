import BaseAlert from "@/renderer/components/alerts/BaseAlert";
import { AlertProps } from "@mui/material";
import React from "react";

type PickedProps = Omit<AlertProps, "severity" | "content">;

interface InfoAlertProps extends PickedProps {
    content: string | React.ReactNode;
}

export default function InfoAlert({
    content, ...alertProps
}: InfoAlertProps) {

    return <BaseAlert
        severity="info"
        content={content}
        {...alertProps}
    />
}