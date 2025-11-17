import BaseAlert from "@/renderer/components/alerts/BaseAlert";
import { AlertProps } from "@mui/material";
import React from "react";

type PickedProps = Omit<AlertProps, "severity" | "content">;

interface SuccessAlertProps extends PickedProps {
    content: string | React.ReactNode;
}

export default function SuccessAlert({
    content, ...alertProps
}: SuccessAlertProps) {

    return <BaseAlert
        severity="success"
        content={content}
        {...alertProps}
    />
}