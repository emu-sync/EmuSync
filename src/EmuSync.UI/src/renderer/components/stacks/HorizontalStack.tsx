import { Stack, StackProps } from "@mui/material";

export default function HorizontalStack(props: StackProps) {

    const { children, sx, gap, ...stackProps } = props;

    const mergedSx = {
        width: "100%",
        ...sx
    }

    return <Stack
        {...stackProps}

        direction="row"
        alignItems="center"

        gap={gap ?? 2}
        sx={mergedSx}
    >
        {children}
    </Stack>
}