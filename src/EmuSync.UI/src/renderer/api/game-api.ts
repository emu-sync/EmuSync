import { get, post, put, remove } from "@/renderer/api/api-helper";
import { CreateGame, Game, GameSuggestion, GameSummary, UpdateGame } from "@/renderer/types";

const controller = "Game"

export async function getGameList(forceReload: boolean = false): Promise<GameSummary[]> {

    const path = `${controller}`;

    return await get({
        path,
        query: {
            forceReload
        }
    });

}

export async function getGameSuggestionsList(): Promise<GameSuggestion[]> {

    const path = `${controller}/Suggestions`;

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

export async function createGame(body: CreateGame): Promise<GameSummary> {

    const path = `${controller}`;

    return await post({
        path,
        body
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