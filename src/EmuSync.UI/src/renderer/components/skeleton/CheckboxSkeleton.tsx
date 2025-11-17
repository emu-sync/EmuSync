import { Checkbox, FormControlLabel, Skeleton } from "@mui/material";

interface CheckboxSkeletonProps {
    width: number;
}

export default function CheckboxSkeleton({
    width
}: CheckboxSkeletonProps) {

    return <FormControlLabel
        control={
            <Checkbox
                disabled
            />
        }
        label={
            <Skeleton
                variant="text"
                width={width}
                height={40}
            />
        }
    />
}