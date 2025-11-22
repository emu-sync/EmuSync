import InfoAlert from "@/renderer/components/alerts/InfoAlert";
import LoadingHarness from "@/renderer/components/harnesses/LoadingHarness";
import DeleteModal, { DeleteItemDetails } from "@/renderer/components/modals/DeleteModal";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import { SyncSourceSummary } from "@/renderer/types";
import { CircularProgress, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";

import OsPlatformLogo from "@/renderer/components/os-platform/OsPlatformLogo";
import DeleteIcon from '@mui/icons-material/Delete';
import { UseQueryResult } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";

interface DeviceListProps {
    thisDeviceId: string;
    query: UseQueryResult<SyncSourceSummary[], Error>;
    onDelete: (id: string) => Promise<void>;
}

export default function DeviceList({
    thisDeviceId, query,
    onDelete
}: DeviceListProps) {

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [currentDeleteModel, setCurrentDeleteModel] = useState<DeleteItemDetails | null>(null);

    const handleSuccessfulDelete = useCallback((deleteDetails: DeleteItemDetails) => {
        setDeleteModalIsOpen(false);
        setCurrentDeleteModel(null);
    }, []);


    const handleDeleteClick = useCallback(async (device: SyncSourceSummary) => {

        const details: DeleteItemDetails = {
            id: device.id,
            nameIdentifier: device.name,
            additionalDetailsComponent: <>
                <InfoAlert
                    content="Please note: This doesn't delete any save files stored on the device."
                />
                <Divider />
            </>
        }

        setCurrentDeleteModel(details);
        setDeleteModalIsOpen(true);

    }, []);

    return <>
        <LoadingHarness
            query={query}
            loadingState={
                <LoadingState />
            }
        >
            {
                query.data &&
                <List
                    disablePadding
                >
                    {
                        query.data.map((device, index) => {

                            let name = device.name;

                            if (device.id === thisDeviceId) {
                                name += " (this device)";
                            }

                            return <React.Fragment
                                key={device.id}
                            >
                                <ListItem
                                    sx={{
                                        py: 2
                                    }}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            title="Delete this device"
                                            onClick={() => handleDeleteClick(device)}
                                            color="error"
                                            disabled={query.isRefetching}
                                        >
                                            <DeleteIcon />
                                        </IconButton>

                                    }
                                >

                                    <ListItemAvatar>
                                        <OsPlatformLogo
                                            osPlatform={device.platformId}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={name}
                                    />
                                </ListItem>
                                {
                                    index !== (query.data.length - 1) &&
                                    <Divider />
                                }
                            </React.Fragment>
                        })
                    }

                </List>
            }

        </LoadingHarness>

        <DeleteModal
            isOpen={deleteModalIsOpen}
            setIsOpen={setDeleteModalIsOpen}
            deleteFunction={onDelete}
            deleteDetails={currentDeleteModel}
            postDeleteCallback={handleSuccessfulDelete}
            slotComponent={currentDeleteModel?.additionalDetailsComponent}
            maxWidth="sm"
        />
    </>
}


function LoadingState() {
    return <HorizontalStack>
        <Typography>
            Loading devices...
        </Typography>
        <CircularProgress size={16} />
    </HorizontalStack>
}