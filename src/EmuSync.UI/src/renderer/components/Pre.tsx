import { Typography } from "@mui/material";

export function Pre({ children }: { children: React.ReactNode }) {

    return (
        <Typography
            sx={{
                position: "relative",
                display: "inline",
                padding: "0.5px",
                fontFamily: "monospace",
                overflow: "hidden",
                mx: "1px",
                px: "4px",
                background: "rgb(140,140,140, .10)",
                borderRadius: "5px"
            }}
            component="span"
        >
            {children}
        </Typography>
    );
}
