import { cacheKeys } from "@/renderer/api/cache-keys";
import { getGameSaveFiles } from "@/renderer/api/game-api";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { Checkbox, Chip, FormControlLabel, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

interface IgnoredFilesPickerProps {
    gameId: string;
    syncSourceId: string;
    folderPath?: string | null;
    value: string[] | null | undefined;
    onChange: (paths: string[] | null) => void;
    disabled?: boolean;
};

interface IgnoredFileRow {
    relativePath: string;
    isIgnored: boolean;
    isMissing: boolean;
}

export default function IgnoredFilesPicker({
    gameId, syncSourceId, folderPath,
    value, onChange, disabled
}: IgnoredFilesPickerProps) {

    const query = useQuery({
        queryKey: [cacheKeys.gameSaveFiles(gameId), folderPath],
        queryFn: () => getGameSaveFiles(gameId, syncSourceId),
        enabled: !!folderPath
    });

    const ignoredPaths = useMemo(() => value ?? [], [value]);

    //merge the on-disk file list with the saved ignore list, so entries
    //that no longer exist locally can still be seen and unticked
    const rows = useMemo<IgnoredFileRow[]>(() => {

        const files = query.data ?? [];
        const onDisk = new Set(files.map(f => f.relativePath.toLowerCase()));

        const merged: IgnoredFileRow[] = files.map(f => ({
            relativePath: f.relativePath,
            isIgnored: ignoredPaths.some(p => p.toLowerCase() === f.relativePath.toLowerCase()),
            isMissing: false
        }));

        for (const ignored of ignoredPaths) {
            if (!onDisk.has(ignored.toLowerCase())) {
                merged.push({
                    relativePath: ignored,
                    isIgnored: true,
                    isMissing: true
                });
            }
        }

        return merged.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

    }, [query.data, ignoredPaths]);

    const handleToggle = useCallback((relativePath: string, checked: boolean) => {

        const without = ignoredPaths.filter(p => p.toLowerCase() !== relativePath.toLowerCase());
        const updated = checked ? [...without, relativePath] : without;

        onChange(updated.length > 0 ? updated : null);

    }, [ignoredPaths, onChange]);

    if (!folderPath) {
        return <Typography color="text.secondary">
            Set a sync location for this device to choose files to ignore.
        </Typography>
    }

    if (query.isFetched && rows.length === 0) {
        return <Typography color="text.secondary">
            No files found in the sync location.
        </Typography>
    }

    return <VerticalStack>
        {
            rows.map((row) => (
                <FormControlLabel
                    key={row.relativePath}
                    control={
                        <Checkbox
                            checked={row.isIgnored}
                            onChange={(e) => handleToggle(row.relativePath, e.target.checked)}
                            disabled={disabled || query.isFetching}
                        />
                    }
                    label={
                        <>
                            {row.relativePath}
                            {
                                row.isMissing &&
                                <Chip
                                    label="missing"
                                    size="small"
                                    color="warning"
                                    sx={{ ml: 1 }}
                                />
                            }
                        </>
                    }
                />
            ))
        }
    </VerticalStack>
}
