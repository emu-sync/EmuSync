import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import { Chip, Typography } from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import WarningAlert from "@/renderer/components/alerts/WarningAlert";

interface SectionTitleProps {
    title: string;
    icon?: React.ReactNode;
    sectionIsDirty?: boolean;
}

export default function SectionTitle({
    title, icon, sectionIsDirty
}: SectionTitleProps) {
    return <HorizontalStack sx={{height: 40}}>
        {
            typeof icon !== "undefined" &&
            <>
                {icon}
            </>
        }
        <Typography variant="h6">
            {title}
        </Typography>
        {
            sectionIsDirty &&
            <WarningAlert
                sx={{
                    ml: "auto",
                    p: 0,
                    px: 1,
                }}
                content="You have unsaved changes"
            />
        }
    </HorizontalStack>
}