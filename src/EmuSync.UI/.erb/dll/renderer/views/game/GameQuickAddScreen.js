"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameQuickAddScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const game_api_1 = require("@/renderer/api/game-api");
const BackToListButton_1 = __importDefault(require("@/renderer/components/buttons/BackToListButton"));
const ButtonRow_1 = __importDefault(require("@/renderer/components/buttons/ButtonRow"));
const GameSuggestionAutocomplete_1 = __importDefault(require("@/renderer/components/inputs/GameSuggestionAutocomplete"));
const Pre_1 = require("@/renderer/components/Pre");
const Section_1 = __importDefault(require("@/renderer/components/Section"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const use_alerts_1 = __importDefault(require("@/renderer/hooks/use-alerts"));
const use_list_query_1 = __importDefault(require("@/renderer/hooks/use-list-query"));
const routes_1 = require("@/renderer/routes");
const local_sync_source_1 = require("@/renderer/state/local-sync-source");
const enums_1 = require("@/renderer/types/enums");
const QuickAddGame_1 = __importDefault(require("@/renderer/views/game/components/QuickAddGame"));
const DividerWord_1 = __importDefault(require("@/renderer/views/game/DividerWord"));
const quick_add_utils_1 = require("@/renderer/views/game/utils/quick-add-utils");
const material_1 = require("@mui/material");
const react_query_1 = require("@tanstack/react-query");
const jotai_1 = require("jotai");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const Icon = routes_1.routes.gameQuickAdd.icon;
function GameQuickAddScreen() {
    const [localSyncSource] = (0, jotai_1.useAtom)(local_sync_source_1.localSyncSourceAtom);
    const { successAlert, errorAlert } = (0, use_alerts_1.default)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const [existingGameInput, setExistingGameInput] = (0, react_1.useState)("");
    const thisDeviceIsWindows = (0, react_1.useMemo)(() => {
        return localSyncSource.platformId === enums_1.OsPlatform.Windows;
    }, [localSyncSource]);
    const { query } = (0, use_list_query_1.default)({
        queryFn: async () => (0, game_api_1.getGameList)(),
        resetCacheFn: game_api_1.clearGameCache,
        queryKey: [cache_keys_1.cacheKeys.gameList],
        relatedQueryKeys: [cache_keys_1.cacheKeys.gameList],
        mutationFn: async () => { }
    });
    const fullGameList = query.data ?? [];
    const { handleSubmit, control, reset, watch } = (0, react_hook_form_1.useForm)({
        defaultValues: (0, quick_add_utils_1.getDefaultValues)()
    });
    const watchedGames = (0, react_hook_form_1.useWatch)({
        control,
        name: "games"
    });
    const { fields: selectedGames, append, remove } = (0, react_hook_form_1.useFieldArray)({
        control,
        name: "games"
    });
    const updateMutation = (0, react_query_1.useMutation)({
        mutationFn: (body) => (0, game_api_1.quickAddGames)(body),
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: [cache_keys_1.cacheKeys.gameList] });
            reset();
            successAlert("Games added/updated successfully");
        },
        onError: async () => {
            errorAlert("An error occurred");
        },
    });
    const remainingGames = (0, react_1.useMemo)(() => {
        if (!watchedGames || watchedGames.length === 0) {
            return fullGameList;
        }
        const selectedIds = new Set(watchedGames.filter(game => !!game.existingGame).map(game => game.existingGame.id));
        return fullGameList.filter(game => !selectedIds.has(game.id));
    }, [watchedGames, fullGameList]);
    const handleFormSubmit = (0, react_1.useCallback)((data) => {
        const body = (0, quick_add_utils_1.convertToRequestBody)(data, thisDeviceIsWindows);
        updateMutation.mutate(body);
    }, [thisDeviceIsWindows]);
    const handleGameSuggestionSelect = (0, react_1.useCallback)((game, filePath) => {
        const existingGame = remainingGames.find(g => g.name === game.name) ?? null;
        const quickAddGame = {
            name: game.name,
            path: filePath,
            maxLocalBackups: existingGame?.maximumLocalGameBackups ?? null,
            existingGame,
            autoSync: existingGame?.autoSync ?? false,
            isNewGameOnly: false
        };
        append(quickAddGame);
    }, [append, remainingGames]);
    const handleExistingGameSelect = (0, react_1.useCallback)((game) => {
        setExistingGameInput(""); // immediately clear the input
        if (game === null)
            return;
        const filePath = game.syncSourceIdLocations?.[localSyncSource.id] ?? "";
        const quickAddGame = {
            name: game.name,
            path: filePath,
            maxLocalBackups: game.maximumLocalGameBackups,
            existingGame: game,
            autoSync: game.autoSync,
            isNewGameOnly: false
        };
        append(quickAddGame);
    }, [append, localSyncSource]);
    const addEmptyGame = (0, react_1.useCallback)(() => {
        const quickAddGame = {
            name: "",
            path: "",
            maxLocalBackups: null,
            existingGame: null,
            autoSync: false,
            isNewGameOnly: true
        };
        append(quickAddGame);
    }, [append]);
    const handleGameSuggestionRemove = (0, react_1.useCallback)((gameIndex) => {
        remove(gameIndex);
    }, [remove]);
    const isSubmitting = updateMutation.isPending;
    return (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, gap: 2, children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { size: {
                    xs: 12,
                    lg: 5
                }, children: (0, jsx_runtime_1.jsx)(material_1.Box, { sx: {
                        position: {
                            xs: "initial",
                            lg: "sticky"
                        },
                        top: {
                            xs: undefined,
                            lg: 0
                        },
                    }, children: (0, jsx_runtime_1.jsxs)(Section_1.default, { children: [(0, jsx_runtime_1.jsx)(BackToListButton_1.default, { href: routes_1.routes.game.href, disableFloat: true, disableMargin: true }), (0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: routes_1.routes.gameQuickAdd.title, icon: (0, jsx_runtime_1.jsx)(Icon, {}) }), (0, jsx_runtime_1.jsx)(GameSuggestionAutocomplete_1.default, { disabled: query.isLoading || isSubmitting, onSelect: handleGameSuggestionSelect }), (0, jsx_runtime_1.jsx)(DividerWord_1.default, { word: "OR" }), (0, jsx_runtime_1.jsx)(material_1.Autocomplete, { disabled: isSubmitting, options: remainingGames, getOptionLabel: (option) => option.name, onChange: (e, value) => handleExistingGameSelect(value), 
                                // control the selected value (always null since we just append)
                                value: null, 
                                // control the input text
                                inputValue: existingGameInput, onInputChange: (e, newInputValue) => setExistingGameInput(newInputValue), disableCloseOnSelect: true, renderInput: (params) => (0, jsx_runtime_1.jsx)(material_1.TextField, { ...params, placeholder: "Select an existing game to update it", label: "Existing games", slotProps: {
                                        inputLabel: {
                                            shrink: true,
                                        },
                                    } }) }), (0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsxs)(ButtonRow_1.default, { children: [(0, jsx_runtime_1.jsx)("form", { onSubmit: handleSubmit(handleFormSubmit), children: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", type: "submit", disabled: query.isLoading || isSubmitting || selectedGames.length === 0, loading: isSubmitting, children: "Save" }) }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", onClick: addEmptyGame, color: "success", sx: {
                                            ml: "auto"
                                        }, disabled: query.isLoading || isSubmitting, children: "Add game" })] })] }) }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { size: "grow", children: selectedGames.length > 0 ?
                    (0, jsx_runtime_1.jsx)(VerticalStack_1.default, { children: selectedGames.map((game, index) => {
                            return (0, jsx_runtime_1.jsx)(QuickAddGame_1.default, { index: index, fullGameList: remainingGames, control: control, onRemoveGame: handleGameSuggestionRemove, disabled: isSubmitting }, game.id);
                        }) })
                    :
                        (0, jsx_runtime_1.jsx)(InfoPlaceholder, {}) })] });
}
function InfoPlaceholder() {
    return (0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 2, sx: {
            p: 2
        }, component: VerticalStack_1.default, children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["Select a game from the suggestions list or use the ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "Add game" }), " button to add a new game. You can only set the save file location for this device using this section."] }), (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Existing games can be updated and are matched by name when you pick a suggestion. This isn't foolproof because names are not unique in EmuSync, so use with caution and always check the correct game has been selected." })] });
}
//# sourceMappingURL=GameQuickAddScreen.js.map