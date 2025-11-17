"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameAddScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const game_api_1 = require("@/renderer/api/game-api");
const BackToListButton_1 = __importDefault(require("@/renderer/components/buttons/BackToListButton"));
const Container_1 = __importDefault(require("@/renderer/components/Container"));
const use_edit_query_1 = __importDefault(require("@/renderer/hooks/use-edit-query"));
const routes_1 = require("@/renderer/routes");
const GameForm_1 = __importDefault(require("@/renderer/views/game/forms/GameForm"));
function GameAddScreen() {
    const { query, updateMutation } = (0, use_edit_query_1.default)({
        queryFn: () => {
            return null;
        },
        queryKey: [],
        relatedQueryKeys: [cache_keys_1.cacheKeys.gameList],
        mutationFn: game_api_1.createGame,
        successMessage: (game) => `Successfully created game: ${game.name}`,
        errorMessage: () => "Failed to create game"
    });
    return (0, jsx_runtime_1.jsxs)(Container_1.default, { children: [(0, jsx_runtime_1.jsx)(BackToListButton_1.default, { href: routes_1.routes.game.href }), (0, jsx_runtime_1.jsx)(GameForm_1.default, { isEdit: false, query: query, saveMutation: updateMutation })] });
}
//# sourceMappingURL=GameAddScreen.js.map