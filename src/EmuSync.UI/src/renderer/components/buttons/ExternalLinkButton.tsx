import { Pre } from "@/renderer/components/Pre";
import { Button } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";

interface ButtonRowProps {
    href: string;
    text: string;
}

export default function ExternalLinkButton({
    href, text
}: ButtonRowProps) {


    const openLink = () => {
        window.electron.openExternalLink(href);
    }

    return <Button
        sx={{
            p: 0,
            mx: 0.15,
            minWidth: 0,
            width: "auto",
        }}
        onClick={openLink}
        title={`Open ${href} in your browser window`}
    >
        <Pre>
            <HorizontalStack gap={0.5}>
                <span>{text}</span>
                <OpenInNewIcon
                    sx={{
                        mt: -1.25,
                        ml: -0.25,
                        fontSize: "0.75rem"
                    }}
                />
            </HorizontalStack>

        </Pre>
    </Button>
}