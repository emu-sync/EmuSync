import { Skeleton } from "@mui/material";

interface ButtonSkeletonProps {
    width: number;
}

export default function ButtonSkeleton({
    width
}: ButtonSkeletonProps) {
    return <Skeleton
        variant="rounded"
        width={width}
        height={37}
        sx={{
            borderRadius: 50
        }}
    />
}