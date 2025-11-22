import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { StorageProvider } from "@/renderer/types/enums";
import { Button, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CircularProgress } from "@mui/material";

import InfoAlert from "@/renderer/components/alerts/InfoAlert";
import ShowModal from "@/renderer/components/modals/ShowModal";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";

import { getDropboxAuthUrl, getGoogleAuthUrl, getMicrosoftAuthUrl } from "@/renderer/api/auth-api";
import StorageProviderDetails from "@/renderer/views/this-device/components/StorageProviderDetails";
import { storageProviderMap } from "@/renderer/views/this-device/utils/sync-source-utils";
import useAlerts from "@/renderer/hooks/use-alerts";

interface StorageProviderSelectorProps {
    onConnected: () => void;
}

export default function StorageProviderSelector({
    onConnected
}: StorageProviderSelectorProps) {

    const { errorAlert } = useAlerts();

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [openWindow, setOpenWindow] = useState<Window | null>(null);

    const [dropboxIsLoading, setDropboxIsLoading] = useState(false);
    const [googleIsLoading, setGoogleIsLoading] = useState(false);
    const [onedriveIsLoading, setOnedriveIsLoading] = useState(false);

    const handleSelect = useCallback(async (url: string) => {

        if (openWindow) {
            openWindow.close();
        }

        const newOpenWindow = window.open(
            url,
            "_blank",
            "menubar=no,toolbar=no,location=no,status=no"
        );

        setOpenWindow(newOpenWindow);
        setModalIsOpen(true);

    }, [openWindow]);


    const handleSelectDropbox = useCallback(async () => {

        setDropboxIsLoading(true);

        try {

            const authUrlResponse = await getDropboxAuthUrl();
            handleSelect(authUrlResponse.url);

        } catch (ex) {
            console.error(ex);
            errorAlert("Failed to get Dropbox auth URL");
            setModalIsOpen(false);
        } finally {
            setDropboxIsLoading(false);
        }

    }, [handleSelect]);

    const handleSelectOneDrive = useCallback(async () => {

        setOnedriveIsLoading(true);

        try {

            const authUrlResponse = await getMicrosoftAuthUrl();
            handleSelect(authUrlResponse.url);

        } catch (ex) {
            console.error(ex);
            errorAlert("Failed to get OneDrive auth URL");
            setModalIsOpen(false);
        } finally {
            setOnedriveIsLoading(false);
        }

    }, [handleSelect]);


    const handleSelectGoogle = useCallback(async () => {

        setGoogleIsLoading(true);

        try {

            const authUrlResponse = await getGoogleAuthUrl();
            handleSelect(authUrlResponse.url);

        } catch (ex) {
            console.error(ex);
            errorAlert("Failed to get Google auth URL");
            setModalIsOpen(false);
        } finally {
            setGoogleIsLoading(false);
        }

    }, [handleSelect]);


    useEffect(() => {
        if (!openWindow) return;

        const interval = setInterval(() => {
            if (openWindow.closed) {
                setModalIsOpen(false);
                onConnected();
                setOpenWindow(null);
                clearInterval(interval);
            }
        }, 500); // check every 500ms

        return () => clearInterval(interval);
    }, [openWindow]);

    return <>
        <VerticalStack>

            <InfoAlert
                content={
                    <VerticalStack>
                        <Typography>
                            Please select a provider where your game data will be stored.
                        </Typography>
                        <Typography>
                            Selecting a provider for the first time will open a browser window for you to log in and grant EmuSync permission to your storage.
                        </Typography>
                    </VerticalStack>
                }
            />

            <HorizontalStack>

                <ProviderSelector
                    provider={StorageProvider.GoogleDrive}
                    onSelect={handleSelectGoogle}
                    loading={googleIsLoading}
                />

                <ProviderSelector
                    provider={StorageProvider.Dropbox}
                    onSelect={handleSelectDropbox}
                    loading={dropboxIsLoading}
                />

                <ProviderSelector
                    provider={StorageProvider.OneDrive}
                    onSelect={handleSelectOneDrive}
                    loading={onedriveIsLoading}
                />

            </HorizontalStack>

        </VerticalStack>

        <ShowModal
            isOpen={modalIsOpen}
            setIsOpen={() => { }}
            title="Connecting to provider"
        >
            <VerticalStack>
                <InfoAlert
                    content={
                        <VerticalStack>
                            <Typography>A window should open for you to log in to your provider. EmuSync only has access to the files and folders it creates.</Typography>
                        </VerticalStack>
                    }
                />
                <Typography textAlign="center">
                    <CircularProgress size={20} />
                </Typography>
            </VerticalStack>
        </ShowModal>
    </>
}

interface ProviderSelectorProps {
    provider: StorageProvider;
    onSelect: (provider: StorageProvider) => void;
    loading: boolean;
}

function ProviderSelector({
    provider, onSelect, loading
}: ProviderSelectorProps) {

    const providerDetails = useMemo(() => {
        return storageProviderMap[provider];
    }, [provider]);

    const handleSelect = useCallback(() => {
        onSelect(provider)
    }, [onSelect, provider]);

    return <Button
        onClick={handleSelect}
        color="secondary"
        variant="outlined"
        sx={{
            fontWeight: "bold",
            mx: "auto",
            height: 150,
            width: "100%"
        }}
        loading={loading}
    >
        <StorageProviderDetails
            image={providerDetails.image}
            name={providerDetails.name}
            direction="column"
        />
    </Button>
}