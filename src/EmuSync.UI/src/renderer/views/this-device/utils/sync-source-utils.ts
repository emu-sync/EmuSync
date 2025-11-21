import { SyncSource, UpdateSyncSource } from "@/renderer/types";
import { StorageProvider } from "@/renderer/types/enums";


import dropboxLogo from "@assets/images/dropbox-logo.png";
import googleDriveLogo from "@assets/images/google-drive-icon.webp";

export const storageProviderMap = {
    [StorageProvider.GoogleDrive]: {
        name: "Google drive",
        image: googleDriveLogo
    },

    [StorageProvider.Dropbox]: {
        name: "Dropbox",
        image: dropboxLogo
    },
}

export const defaultSyncSource: UpdateSyncSource = {
    name: "",
    autoSyncFrequencyMins: null
};

export function transformSyncSource(syncSource: SyncSource): UpdateSyncSource {
    return {
        name: syncSource.name,
        autoSyncFrequencyMins: syncSource.autoSyncFrequencyMins ?? null
    }
}