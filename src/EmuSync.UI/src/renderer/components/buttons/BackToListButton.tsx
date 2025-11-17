import LinkButton from "@/renderer/components/buttons/LinkButton";
import { siteSettings } from "@/renderer/site-settings";
import { sidebarConfigAtom } from "@/renderer/state/sidebar-config";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, SxProps } from "@mui/material";
import { useAtom } from "jotai";

interface BackToListButtonProps {
    href: string;
    disabled?: boolean;
    buttonSx?: SxProps;
}

const { sidebarMinimisedWidth, sidebarWidth, headerHeight, sidebarTransitionTime } = siteSettings.layoutProperties;

export default function BackToListButton({
    href, ...buttonProps
}: BackToListButtonProps) {

    const [sidebarConfig] = useAtom(sidebarConfigAtom);
    const left = sidebarConfig.isMinimised ? sidebarMinimisedWidth : sidebarWidth;

    return <Box
        //gives a pretty nice effect when in full screen
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
        <LinkButton

            href={href}
            title="Back to list"
            buttonStartIcon={<ArrowBackIosNewIcon />}

            {...buttonProps}
        >
            Back to list
        </LinkButton>
    </Box>
}