import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { Divider, Typography } from "@mui/material";


interface ReadmeTitleProps {
    title: string;    
    scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ReadmeTitle({
    title, scrollRef
}: ReadmeTitleProps) {

    return <VerticalStack gap={1} ref={scrollRef}>
        <Typography variant="h5">
            {title}
        </Typography>
        <Divider />
    </VerticalStack>
}