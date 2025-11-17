import { Stack, StackProps } from "@mui/material";

export default function VerticalStack(props: StackProps) {

    const { children, gap, ...stackProps } = props;

    return <Stack
        {...stackProps}

        gap={gap ?? 2.5}
    >
        {children}
    </Stack>
}