import { SyncType } from "@/renderer/types/enums";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Chip, SxProps } from "@mui/material";

interface SyncTypeChipProps {
    syncType: SyncType;
    sx: SxProps;
}
export function SyncTypeChip({
    syncType, sx
}: SyncTypeChipProps) {
    switch (syncType) {

        case SyncType.Download:
            return <Chip
                icon={<CloudDownloadIcon />}
                label="Downloaded"
                title="The game files were downloaded to this device"
                color="warning"
                sx={sx}
            />;

        case SyncType.Upload:
            return <Chip
                icon={<CloudUploadIcon />}
                label="Uploaded"
                title="The game files were uploaded from this device"
                color="info"
                sx={sx}
            />;

        default:
            return undefined;
    }
}