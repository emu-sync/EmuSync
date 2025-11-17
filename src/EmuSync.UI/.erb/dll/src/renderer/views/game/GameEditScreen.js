"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameEditScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const game_api_1 = require("@/renderer/api/game-api");
const BackToListButton_1 = __importDefault(require("@/renderer/components/buttons/BackToListButton"));
const Container_1 = __importDefault(require("@/renderer/components/Container"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const use_edit_query_1 = __importDefault(require("@/renderer/hooks/use-edit-query"));
const use_id_query_param_1 = __importDefault(require("@/renderer/hooks/use-id-query-param"));
const routes_1 = require("@/renderer/routes");
const GameForm_1 = __importDefault(require("@/renderer/views/game/forms/GameForm"));
const SyncStatusForm_1 = __importDefault(require("@/renderer/views/game/forms/SyncStatusForm"));
const material_1 = require("@mui/material");
const react_1 = require("react");
function GameEditScreen() {
    const id = (0, use_id_query_param_1.default)();
    const gameCacheKey = (0, react_1.useMemo)(() => {
        return cache_keys_1.cacheKeys.game(id);
    }, [id]);
    const gameSyncStatusKey = (0, react_1.useMemo)(() => {
        return cache_keys_1.cacheKeys.gameSyncStatus(id);
    }, [id]);
    const { query, updateMutation } = (0, use_edit_query_1.default)({
        queryFn: () => (0, game_api_1.getGameById)(id),
        queryKey: [gameCacheKey],
        relatedQueryKeys: [gameCacheKey, cache_keys_1.cacheKeys.gameList, gameSyncStatusKey],
        mutationFn: game_api_1.updateGame
    });
    return (0, jsx_runtime_1.jsxs)(Container_1.default, { children: [(0, jsx_runtime_1.jsx)(BackToListButton_1.default, { href: routes_1.routes.game.href }), (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(GameForm_1.default, { isEdit: true, query: query, saveMutation: updateMutation }), (0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(SyncStatusForm_1.default, { gameId: id })] })] });
}
//# sourceMappingURL=GameEditScreen.js.map