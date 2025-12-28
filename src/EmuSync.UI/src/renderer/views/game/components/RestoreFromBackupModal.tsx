
import DisplayDate from "@/renderer/components/dates/DisplayDate";
import ShowModal from "@/renderer/components/modals/ShowModal";
import { Pre } from "@/renderer/components/Pre";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import { GameBackupManifest } from "@/renderer/types";
import { Button, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import React from "react";
import { useMemo } from "react";


interface RestoreFromBackupModalProps {
    backups: GameBackupManifest[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSelectBackup: (backupId: string) => void;
}

export default function RestoreFromBackupModal({
    backups,
    isOpen, setIsOpen,
    onSelectBackup
}: RestoreFromBackupModalProps) {

    const orderedBackups = useMemo(() => {
        return backups.sort((a, b) => {
            const dateA = new Date(a.createdOnUtc).getTime();
            const dateB = new Date(b.createdOnUtc).getTime();

            return dateB - dateA;
        });
    }, [backups]);

    const BackupsListMemo = useMemo(() => {

        return orderedBackups.map((backup, index) => {

            const date = new Date(backup.createdOnUtc);

            return <React.Fragment
                key={backup.id}
            >
                <ListItem
                    secondaryAction={
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => onSelectBackup(backup.id)}
                        >
                            Use this backup
                        </Button>
                    }
                >
                    <ListItemText
                        primary={
                            <HorizontalStack gap={0.5}>
                                <Typography>
                                    A backup taken
                                </Typography>
                                <DisplayDate
                                    date={date}
                                    displayAsFromNow
                                />
                            </HorizontalStack>
                        }
                    />
                </ListItem>

                {
                    index < (orderedBackups.length - 1) &&
                    <Divider component="li" />
                }


            </React.Fragment>

        })

    }, [orderedBackups]);

    return <ShowModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Select a backup"
        showCloseButton
        maxWidth="md"
    >

        <List>
            {BackupsListMemo}
        </List>
    </ShowModal>

}