import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { IconButton } from '@mui/material';
import { useCallback } from 'react';

interface PickDirectoryButtonProps {
    disabled?: boolean;
    onPickDirectory: (directory: string) => void;
}

export default function PickDirectoryButton({
    disabled, onPickDirectory
}: PickDirectoryButtonProps) {

    const handlePick = useCallback(async () => {

        const path = await window.electron.openDirectory();
        onPickDirectory(path ?? "");
        
    }, []);

    return <IconButton
        color="primary"
        title="Pick a directory"
        disabled={disabled}
        onClick={handlePick}
    >
        <FolderOpenIcon />
    </IconButton>
}
