import { Alert, AlertProps, Typography } from "@mui/material";
import React, { useMemo } from "react";

type PickedProps = Omit<AlertProps, | "content">;

interface BaseAlertProps extends PickedProps {
    content: string | React.ReactNode;
}

export default function BaseAlert({
   severity, content, ...alertProps
}: BaseAlertProps) {

    const alertContent = useMemo(() => {
        if (typeof content === "string") {
            return <Typography>
                {content}
            </Typography>
        }

        return content;
    }, [content]);

    return <Alert
        severity={severity}
        {...alertProps}
    >
        {alertContent}
    </Alert>
}