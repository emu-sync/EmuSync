import { osPlatforms } from "@/renderer/components/os-platform/os-platforms";
import { OsPlatform } from "@/renderer/types/enums";
import { Typography } from "@mui/material";
import { useMemo } from "react";

interface OsPlatformNameProps {
    osPlatform: OsPlatform | null;
}

export default function OsPlatformName({
    osPlatform
}: OsPlatformNameProps) {

    const platformDetails = useMemo(() => {
        if (!osPlatform) return null;
        return osPlatforms[osPlatform];
    }, [osPlatform]);

    return <Typography>
        {platformDetails?.name ?? "Unknown"}
    </Typography>
}