import { get, post, postWithNoResponse, put, remove } from "@/renderer/api/api-helper";
import { CreateGame, Game, GameBackupManifest, GameSaveFile, GameSuggestion, GameSummary, QuickAddRequestBody, UpdateGame } from "@/renderer/types";

const controller = "Game"

export async function getGameList(): Promise<GameSummary[]> {

    const path = `${controller}`;

    return await get({
        path
    });

}

export async function getGameSuggestionsList(): Promise<GameSuggestion[]> {

    const path = `${controller}/Suggestions`;

    return await get({
        path
    });

}

export async function getGameBackups(id: string): Promise<GameBackupManifest[]> {

    const path = `${controller}/${id}/Backups`;

    return await get({
        path
    });

}

export async function getGameById(id: string): Promise<Game> {

    const path = `${controller}/${id}`;

    return await get({
        path
    });

}

export async function getGameSaveFiles(id: string, syncSourceId: string): Promise<GameSaveFile[]> {

    const path = `${controller}/${id}/SaveFiles?syncSourceId=${encodeURIComponent(syncSourceId)}`;

    return await get({
        path
    });

}

export async function createGame(body: CreateGame): Promise<GameSummary> {

    const path = `${controller}`;

    return await post({
        path,
        body
    });

}

export async function clearGameCache(): Promise<void> {

    const path = `${controller}/ClearCache`;

    return await postWithNoResponse({
        path,
    });

}

export async function updateGame(body: UpdateGame): Promise<void> {

    const path = `${controller}/${body.id}`;

    await put({
        path,
        body
    });

}

export async function deleteGame(id: string): Promise<void> {

    const path = `${controller}/${id}`;

    await remove({
        path
    });

}

export async function quickAddGames(body: QuickAddRequestBody): Promise<void> {

    const path = `${controller}/QuickAdd`;

    return await postWithNoResponse({
        path,
        body
    });

}