import { Skeleton } from "@mui/material";


export default function TextFieldSkeleton() {
    return <Skeleton
        variant="rounded"
        height={54.5}
        sx={{
            borderRadius: 4
        }}
    />
}