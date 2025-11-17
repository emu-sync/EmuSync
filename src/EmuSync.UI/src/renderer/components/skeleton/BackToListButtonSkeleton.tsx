import { siteSettings } from "@/renderer/site-settings";
import { sidebarConfigAtom } from "@/renderer/state/sidebar-config";
import { Box, Skeleton } from "@mui/material";
import { useAtom } from "jotai";

const { sidebarMinimisedWidth, sidebarWidth, headerHeight, sidebarTransitionTime } = siteSettings.layoutProperties;

export default function BackToListButtonSkeleton() {

    const [sidebarConfig] = useAtom(sidebarConfigAtom);
    const left = sidebarConfig.isMinimised ? sidebarMinimisedWidth : sidebarWidth;

    return <Box
        sx={{
            position: {
                xs: "initial",
                lg: "absolute"
            },
            mb: {
                xs: 2,
                lg: 0
            },
            transition: `left ${sidebarTransitionTime}`,
            left: `calc(${left} + 30px)`,
            top: `calc(${headerHeight}px + 30px)`
        }}
    >
        <Skeleton
            variant="rounded"
            width={115}
            height={37}
            sx={{
                borderRadius: 50
            }}
        />
    </Box>
}