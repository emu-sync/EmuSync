import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { Typography } from "@mui/material";


interface FAQProps {
    title: string;
    children: React.ReactNode;
}

export default function FAQ({
    title, children
}: FAQProps) {

    return <VerticalStack
        gap={1}
        sx={{
            my: 1
        }}
    >


        <Typography 
        sx={{ 
            fontWeight: "bold" ,
            fontSize: "1rem"
        }}
        >
            {title}
        </Typography>

        {children}

    </VerticalStack>
}