import { StackOwnProps, Typography } from "@mui/material";
import { Stack } from "@mui/system";

interface StorageProviderDetailsProps {
    image: any;
    name: string
    direction?: StackOwnProps["direction"];
    justifyContent?: StackOwnProps["justifyContent"];
}

export default function StorageProviderDetails({
    image, name, direction, justifyContent
}: StorageProviderDetailsProps) {

    return <Stack
        gap={2}
        alignItems="center"
        direction={direction ?? "row"}
        justifyContent={(justifyContent ?? "center") as never}
    >
        <img
            src={image}
            alt="Provider logo"
            style={{
                height: 25,
                width: "auto"
            }}
        />

        <Typography>
            {name}
        </Typography>
    </Stack>
}