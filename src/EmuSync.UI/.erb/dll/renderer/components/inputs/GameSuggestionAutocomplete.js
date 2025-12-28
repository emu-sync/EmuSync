"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameSuggestionAutocomplete;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const game_api_1 = require("@/renderer/api/game-api");
const LoadingHarness_1 = __importDefault(require("@/renderer/components/harnesses/LoadingHarness"));
const TextFieldSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/TextFieldSkeleton"));
const ChevronRight_1 = __importDefault(require("@mui/icons-material/ChevronRight"));
const material_1 = require("@mui/material");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const material_2 = require("@mui/material");
const Info_1 = __importDefault(require("@mui/icons-material/Info"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const Pre_1 = require("@/renderer/components/Pre");
;
function GameSuggestionAutocomplete({ onSelect }) {
    const [options, setOptions] = (0, react_1.useState)(null);
    const [selectedGame, setSelectedGame] = (0, react_1.useState)(null);
    const [inputValue, setInputValue] = (0, react_1.useState)("");
    const [open, setOpen] = (0, react_1.useState)(false);
    const query = (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.gameSuggestionList],
        queryFn: game_api_1.getGameSuggestionsList
    });
    const optionsToUse = options ?? query.data ?? [];
    return (0, jsx_runtime_1.jsx)(LoadingHarness_1.default, { query: query, loadingState: (0, jsx_runtime_1.jsx)(LoadingState, {}), children: (0, jsx_runtime_1.jsx)(material_1.Autocomplete, { noOptionsText: "Sorry, EmuSync didn't find any game saves on your device.", open: open, onOpen: () => {
                setOpen(true);
                setInputValue("");
                setOptions(null);
                setSelectedGame(null);
            }, onClose: () => setOpen(false), options: optionsToUse, getOptionLabel: (option) => typeof option === "string" ? option : option.name, value: null, inputValue: inputValue, disableCloseOnSelect: true, onInputChange: (event, value) => setInputValue(value), onChange: (event, value) => {
                if (!value)
                    return;
                // inal path selected
                if (typeof value === "string" && selectedGame) {
                    onSelect(selectedGame, value);
                    setOptions(null);
                    setSelectedGame(null);
                    setOpen(false);
                }
                //game with only one path
                else if (typeof value !== "string" && value.suggestedFolderPaths.length === 1) {
                    onSelect(value, value.suggestedFolderPaths[0]);
                    setOptions(null);
                    setSelectedGame(null);
                    setOpen(false);
                }
                //game with multiple paths
                else if (typeof value !== "string") {
                    setSelectedGame(value);
                    setOptions(value.suggestedFolderPaths);
                    setOpen(true);
                }
                setInputValue("");
            }, renderOption: (props, option) => {
                const { key, ...remainingProps } = props;
                if (typeof option === "string") {
                    return (0, jsx_runtime_1.jsx)("li", { ...remainingProps, children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: option }) }, key);
                }
                return (0, jsx_runtime_1.jsxs)("li", { ...remainingProps, style: { display: "flex", justifyContent: "space-between" }, children: [(0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: option.name }), option.suggestedFolderPaths.length > 1 && (0, jsx_runtime_1.jsx)(ChevronRight_1.default, { fontSize: "small" })] }, key);
            }, renderInput: (params) => (0, jsx_runtime_1.jsx)(material_1.TextField, { ...params, placeholder: "Search for a game suggestion", label: "Game suggestions", slotProps: {
                    inputLabel: {
                        shrink: true,
                    },
                }, InputProps: {
                    ...params.InputProps,
                    endAdornment: ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [params.InputProps.endAdornment, (0, jsx_runtime_1.jsx)(material_2.InputAdornment, { position: "end", children: (0, jsx_runtime_1.jsx)(material_2.Tooltip, { title: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Can't find your game?" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "EmuSync will scan your device for known save locations of games using data compiled from PCGamingWiki." }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["Unfortunately this doesn't work for emulated game saves, and also isn't perfect, so your game may not appear. You can try and trigger a rescan in the ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "This device" }), " section."] }), (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "This also may not work if you've acquired your game through illegitimate means, as sometimes the save location is different." }), (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Always double check the path is correct!" })] }), children: (0, jsx_runtime_1.jsx)(Info_1.default, { fontSize: "small", color: "info" }) }) })] })),
                } }) }) });
}
function LoadingState() {
    return (0, jsx_runtime_1.jsx)(TextFieldSkeleton_1.default, {});
}
//# sourceMappingURL=GameSuggestionAutocomplete.js.map