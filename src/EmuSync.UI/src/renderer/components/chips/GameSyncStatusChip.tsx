import { GameSyncStatus } from "@/renderer/types/enums";
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FolderOffIcon from '@mui/icons-material/FolderOff';
import HelpIcon from "@mui/icons-material/Help";
import { Chip, SxProps } from "@mui/material";

interface GameSyncStatusChipProps {
    status: GameSyncStatus;
}

const circleSx: SxProps = {
    borderRadius: "50%",
    padding: 0,
    width: 32,
    height: 32,
    "& .MuiChip-icon": {
        margin: 0
    },
    "& .MuiChip-label": {
        display: "none"
    }
};

export function GameSyncStatusChip({
    status
}: GameSyncStatusChipProps) {
    switch (status) {
        case GameSyncStatus.RequiresDownload:
            return <Chip
                icon={<CloudDownloadIcon />}
                title="Requires downloading on this device"
                color="warning"
                size="small"
                sx={circleSx}
            />;

        case GameSyncStatus.RequiresUpload:
            return <Chip
                icon={<CloudUploadIcon />}
                title="Requires uploading from this device"
                color="info"
                size="small"
                sx={circleSx}
            />;

        case GameSyncStatus.InSync:
            return <Chip
                icon={<CloudDoneIcon />}
                title="In Sync with cloud"
                color="success"
                size="small"
                sx={circleSx}
            />;

        case GameSyncStatus.UnsetDirectory:
            return <Chip
                icon={<FolderOffIcon />}
                title="Directory not set for this device"
                color="error"
                size="small"
                sx={circleSx}
            />;

        default:
            return <Chip
                icon={<HelpIcon />}
                title="Unknown"
                color="default"
                size="small"
                sx={circleSx}
            />;
    }
}