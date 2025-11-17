import { Typography } from "@mui/material";


interface ReadmeParagraphProps {
    children: React.ReactNode;
}

export default function ReadmeParagraph({
    children
}: ReadmeParagraphProps) {

    return <Typography variant="body1">
        {children}
    </Typography>
}