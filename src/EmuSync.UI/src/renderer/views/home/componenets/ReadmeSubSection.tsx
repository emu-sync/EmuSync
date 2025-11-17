import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { Typography } from "@mui/material";


interface ReadmeSubSectionProps {
    title: string;
    disableMarginBottom?: boolean;
    children: React.ReactNode;
}

export default function ReadmeSubSection({
    title, children, disableMarginBottom
}: ReadmeSubSectionProps) {

    return <VerticalStack
        gap={1}
        sx={{
            px: 3,
            my: 3,
            mb: disableMarginBottom ? 0 : undefined
        }}
    >

        <Typography variant="h6">
            {title}
        </Typography>

        {children}
    </VerticalStack>
}