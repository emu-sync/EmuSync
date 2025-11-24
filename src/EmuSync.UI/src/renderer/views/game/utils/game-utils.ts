import { CreateGame, Game, GameSyncStatus, SyncSourceSummary, UpdateGame } from "@/renderer/types";
import { OsPlatform } from "@/renderer/types/enums";

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

export function replacePathDelims(syncSources: SyncSourceSummary[], game: UpdateGame | CreateGame) {
    if (!game.syncSourceIdLocations) return game;

    const updated: Record<string, string> = {};

    for (const [id, path] of Object.entries(game.syncSourceIdLocations)) {

        const syncSource = syncSources.find(s => s.id === id);

        if (!syncSource || !path) {
            continue;
        }

        const isWindows = syncSource.platformId === OsPlatform.Windows;

        updated[id] = isWindows
            ? path.replace(/\//g, "\\") //normalise → Windows
            : path.replace(/\\/g, "/"); //normalise → mac + linux
    }

    return {
        ...game,
        syncSourceIdLocations: updated
    };
}