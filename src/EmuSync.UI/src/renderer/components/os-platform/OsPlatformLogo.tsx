import { osPlatforms } from "@/renderer/components/os-platform/os-platforms";
import { OsPlatform } from "@/renderer/types/enums";
import { Box } from "@mui/system";
import { useMemo } from "react";

interface PlatformLogoProps {
    osPlatform: OsPlatform | null;
}

export default function OsPlatformLogo({
    osPlatform
}: PlatformLogoProps) {

    const platformDetails = useMemo(() => {
        if(!osPlatform) return null;
        return osPlatforms[osPlatform];
    }, [osPlatform]);

    return <>
        {
            platformDetails?.image &&
            <Box
                sx={{
                    height: 35,
                    width: 35,
                    background: "white",
                    borderRadius: 50,
                    padding: "0.45rem"
                }}
            >
                <img
                    src={platformDetails.image}
                    alt="Platform logo"
                    style={{
                        height: "100%",
                        width: "auto",
                    }}
                />
            </Box>
        }
    </>
}