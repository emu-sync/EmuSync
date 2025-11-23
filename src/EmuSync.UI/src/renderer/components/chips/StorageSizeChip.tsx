import { Chip, ChipOwnProps, SxProps } from "@mui/material";
import StorageIcon from '@mui/icons-material/Storage';
import { useMemo } from "react";

const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

interface StorageChipProps {
    bytes: number;
    size?: ChipOwnProps["size"];
    sx?: SxProps;
}


export default function StorageChip({
    bytes, size, sx
}: StorageChipProps) {

    const storageSize = useMemo(() => {
        return formatBytes(bytes)
    }, [bytes]);

    return <Chip
        icon={<StorageIcon />}
        label={storageSize}
        size={size ?? "small"}
        title={`The size of all files is ${storageSize}`}
        sx={sx}
    />;
}
