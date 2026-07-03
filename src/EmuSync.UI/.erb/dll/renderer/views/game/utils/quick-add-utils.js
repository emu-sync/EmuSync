"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultValues = getDefaultValues;
exports.convertToRequestBody = convertToRequestBody;
exports.filePathIsUnchanged = filePathIsUnchanged;
const path_utils_1 = require("@/renderer/utils/path-utils");
function getDefaultValues() {
    return {
        games: []
    };
}
function convertToRequestBody(form, isWindows) {
    const output = {
        games: form.games.map(game => {
            const gameExists = game.existingGame !== null;
            return {
                existingGameId: game.existingGame?.id ?? null,
                path: (0, path_utils_1.normalisePathDelims)(game.path, isWindows),
                gameName: gameExists ? null : game.name,
                autoSync: game.autoSync,
                maximumLocalGameBackups: game.maxLocalBackups?.toString() === "" ? null : game.maxLocalBackups
            };
        })
    };
    return output;
}
function filePathIsUnchanged(existingGame, gamePath, syncSource) {
    return existingGame?.syncSourceIdLocations?.[syncSource.id] === gamePath;
}
//# sourceMappingURL=quick-add-utils.js.map