"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameList = getGameList;
exports.getGameSuggestionsList = getGameSuggestionsList;
exports.getGameBackups = getGameBackups;
exports.getGameById = getGameById;
exports.createGame = createGame;
exports.clearGameCache = clearGameCache;
exports.updateGame = updateGame;
exports.deleteGame = deleteGame;
const api_helper_1 = require("@/renderer/api/api-helper");
const controller = "Game";
async function getGameList() {
    const path = `${controller}`;
    return await (0, api_helper_1.get)({
        path
    });
}
async function getGameSuggestionsList() {
    const path = `${controller}/Suggestions`;
    return await (0, api_helper_1.get)({
        path
    });
}
async function getGameBackups(id) {
    const path = `${controller}/${id}/Backups`;
    return await (0, api_helper_1.get)({
        path
    });
}
async function getGameById(id) {
    const path = `${controller}/${id}`;
    return await (0, api_helper_1.get)({
        path
    });
}
async function createGame(body) {
    const path = `${controller}`;
    return await (0, api_helper_1.post)({
        path,
        body
    });
}
async function clearGameCache() {
    const path = `${controller}/ClearCache`;
    return await (0, api_helper_1.postWithNoResponse)({
        path,
    });
}
async function updateGame(body) {
    const path = `${controller}/${body.id}`;
    await (0, api_helper_1.put)({
        path,
        body
    });
}
async function deleteGame(id) {
    const path = `${controller}/${id}`;
    await (0, api_helper_1.remove)({
        path
    });
}
//# sourceMappingURL=game-api.js.map