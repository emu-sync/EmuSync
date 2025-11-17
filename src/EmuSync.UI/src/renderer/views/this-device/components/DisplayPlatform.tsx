import { OsPlatform } from "@/renderer/types/enums";
import { Paper } from "@mui/material";

import OsPlatformLogo from "@/renderer/components/os-platform/OsPlatformLogo";
import OsPlatformName from "@/renderer/components/os-platform/OsPlatformName";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";

interface DisplayPlatformProps {
    osPlatform: OsPlatform;
}

export default function DisplayPlatform({
    osPlatform
}: DisplayPlatformProps) {

    return <Paper
        elevation={3}
        sx={{
            p: 2
        }}
        component={HorizontalStack}
        gap={2}
        alignItems="center"
    >
        <OsPlatformLogo
            osPlatform={osPlatform}
        />

        <OsPlatformName
            osPlatform={osPlatform}
        />
    </Paper>
}