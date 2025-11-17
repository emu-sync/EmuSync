import { Skeleton } from "@mui/material";


export default function AlertSkeleton() {
    return <Skeleton
        variant="rounded"
        height={52}
        sx={{
            borderRadius: 4
        }}
    />
}