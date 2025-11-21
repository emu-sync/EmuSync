import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { IconButton } from '@mui/material';
import { useCallback } from 'react';

interface PickDirectoryButtonProps {
    disabled?: boolean;
    defaultPath: string | null;
    onPickDirectory: (directory: string) => void;
}

export default function PickDirectoryButton({
    disabled, defaultPath, onPickDirectory
}: PickDirectoryButtonProps) {

    const handlePick = useCallback(async () => {

        const path = await window.electron.openDirectory(defaultPath);
        const pathToUse = path ?? "";

        if (path) {
            onPickDirectory(pathToUse);
        }

    }, [defaultPath]);

    return <IconButton
        color="primary"
        title="Pick a directory"
        disabled={disabled}
        onClick={handlePick}
    >
        <FolderOpenIcon />
    </IconButton>
}
