import { CreateGame, Game, GameSyncStatus, UpdateGame } from "@/renderer/types";

export const defaultUpdateGame: UpdateGame = {
    id: "",
    name: "",
    autoSync: false,
    syncSourceIdLocations: null
};

export const defaultCreateGame: CreateGame = {
    name: "",
    autoSync: false,
    syncSourceIdLocations: null
};

export function transformUpdateGame(game: Game): UpdateGame {
    return {
        id: game.id,
        autoSync: game.autoSync,
        syncSourceIdLocations: game.syncSourceIdLocations,
        name: game.name
    }
}

export function transformCreateGame(): CreateGame {
    return { ...defaultCreateGame }
}

export function determineGameSyncStatus(gameSyncStatus: GameSyncStatus) {

    const neverSynced = !(gameSyncStatus.lastSyncedFrom);
    const { requiresDownload, requiresUpload } = gameSyncStatus;
    const isUpToDate = !neverSynced && !requiresDownload && !requiresUpload;
    const localPathIsUnset = gameSyncStatus.localFolderPathIsUnset;
    const localPathExists = gameSyncStatus.localFolderPathExists;

    return {
        neverSynced,
        requiresDownload,
        requiresUpload,
        isUpToDate,
        localPathIsUnset,
        localPathExists
    }

}