
import ErrorAlert from "@/renderer/components/alerts/ErrorAlert";
import InfoAlert from "@/renderer/components/alerts/InfoAlert";
import SuccessAlert from "@/renderer/components/alerts/SuccessAlert";
import WarningAlert from "@/renderer/components/alerts/WarningAlert";
import StorageChip from "@/renderer/components/chips/StorageSizeChip";
import DisplayDate from "@/renderer/components/dates/DisplayDate";
import { Pre } from "@/renderer/components/Pre";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import useSyncSourceMapper from "@/renderer/hooks/use-sync-source-mapper";
import { GameSyncStatus } from "@/renderer/types";
import { determineGameSyncStatus } from "@/renderer/views/game/utils/game-utils";
import { Typography } from "@mui/material";

import { useMemo } from "react";

interface DisplayGameSyncStatusProps {
    gameSyncStatus: GameSyncStatus;
}

export default function DisplayGameSyncStatus({
    gameSyncStatus
}: DisplayGameSyncStatusProps) {

    const { mapSyncSource } = useSyncSourceMapper();

    const lastSyncSourceName = useMemo(() => {
        const source = mapSyncSource(gameSyncStatus.lastSyncedFrom ?? "");

        if (!source) return "Unknown device";
        return source.name;

    }, [gameSyncStatus, mapSyncSource]);

    const AlertMemo = useMemo(() => {

        const lastSyncExists = !!(gameSyncStatus.lastSyncedFrom);
        const syncState = determineGameSyncStatus(gameSyncStatus);

        if (syncState.localPathIsUnset) {
            return <ErrorAlert
                content="A sync location must be set for this device."
            />
        }

        if (syncState.neverSynced) {

            let message = "This game hasn't been uploaded from any device yet";

            if (!syncState.localPathExists) {
                message += " - a valid sync location must be set for this device";
            }

            message += ".";

            return <WarningAlert
                content={message}
            />
        }

        const displayDate = <DisplayDate
            date={gameSyncStatus.lastSyncedAtUtc}
            displayAsFromNow
        />

        const displayFullDate = <DisplayDate
            date={gameSyncStatus.lastSyncedAtUtc}
            format="DD/MM/YYYY HH:mm:ss"
        />

        const storageChip = <StorageChip
            bytes={gameSyncStatus.storageBytes}
        />

        const lastSync = lastSyncExists ?
            <Typography>
                Game files were last uploaded from <Pre>{lastSyncSourceName}</Pre> {displayDate} at <Pre>{displayFullDate}</Pre>.
            </Typography>
            : undefined;

        if (syncState.requiresUpload) {
            return <InfoAlert
                action={storageChip}
                content={
                    <VerticalStack>
                        <Typography>
                            Game files are newer and require uploading.
                        </Typography>
                        {
                            lastSync
                        }
                    </VerticalStack>
                }
            />
        }

        if (syncState.requiresDownload) {
            return <WarningAlert
                action={storageChip}
                content={
                    <VerticalStack>
                        <Typography>
                            Game files are out of date and require downloading.
                        </Typography>
                        {
                            lastSync
                        }
                    </VerticalStack>
                }
            />
        }

        return <SuccessAlert
            action={storageChip}
            content={
                <VerticalStack>
                    <Typography>
                        Game files are up to date on this device.
                    </Typography>
                    {
                        lastSync
                    }
                </VerticalStack>
            }
        />

    }, [gameSyncStatus, lastSyncSourceName]);

    return <VerticalStack>
        {AlertMemo}
    </VerticalStack>

}