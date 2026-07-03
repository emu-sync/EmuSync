"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QuickAddGame;
const jsx_runtime_1 = require("react/jsx-runtime");
const PickDirectoryButton_1 = __importDefault(require("@/renderer/components/buttons/PickDirectoryButton"));
const DefaultAutoComplete_1 = __importDefault(require("@/renderer/components/inputs/DefaultAutoComplete"));
const DefaultCheckbox_1 = __importDefault(require("@/renderer/components/inputs/DefaultCheckbox"));
const DefaultTextField_1 = __importDefault(require("@/renderer/components/inputs/DefaultTextField"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const QuickAddGameStatus_1 = __importDefault(require("@/renderer/views/game/components/QuickAddGameStatus"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const material_1 = require("@mui/material");
const react_hook_form_1 = require("react-hook-form");
function QuickAddGame({ index, fullGameList, control, disabled, onRemoveGame }) {
    const isNewGameOnly = (0, react_hook_form_1.useWatch)({ name: `games.${index}.isNewGameOnly`, control });
    const existingGame = (0, react_hook_form_1.useWatch)({ name: `games.${index}.existingGame`, control });
    return (0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 2, sx: {
            p: 2
        }, component: VerticalStack_1.default, children: [(0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(QuickAddGameStatus_1.default, { existingGame: existingGame }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { title: "Remove game", onClick: () => onRemoveGame(index), sx: {
                            ml: "auto"
                        }, disabled: disabled, children: (0, jsx_runtime_1.jsx)(Delete_1.default, { color: "error" }) })] }), (0, jsx_runtime_1.jsx)(material_1.Divider, {}), !isNewGameOnly &&
                (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `games.${index}.existingGame`, control: control, render: ({ field, fieldState }) => {
                        return (0, jsx_runtime_1.jsx)(DefaultAutoComplete_1.default, { field: field, fieldState: fieldState, label: "Existing game", disabled: disabled, options: fullGameList, getOptionLabel: (option) => option.name, placeholder: "Select an existing game to update it", size: "small" });
                    } }), !existingGame &&
                (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `games.${index}.name`, control: control, rules: {
                        required: "Name is required",
                        maxLength: { value: 255, message: "Name must be 255 characters or less" }
                    }, render: ({ field, fieldState }) => {
                        return (0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { required: true, field: field, fieldState: fieldState, label: "Game name", disabled: disabled, placeholder: "Enter a name for the game", size: "small" });
                    } }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `games.${index}.maxLocalBackups`, control: control, rules: {
                    min: { value: 0, message: "Must be greater than -1" },
                    validate: (v) => Number.isInteger(Number(v)) || "Must be a whole number"
                }, render: ({ field, fieldState }) => ((0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { field: field, fieldState: fieldState, label: "Maximum local game backups", type: "number", disabled: disabled, placeholder: "Override the maximum amount of local backups kept for this game", size: "small" })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `games.${index}.path`, control: control, rules: {
                    required: "Sync location is required"
                }, render: ({ field, fieldState }) => {
                    return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { required: true, field: field, fieldState: fieldState, placeholder: "Pick or enter a location for this device", label: "Sync location", disabled: disabled, size: "small" }), (0, jsx_runtime_1.jsx)(PickDirectoryButton_1.default, { disabled: disabled, defaultPath: field.value, onPickDirectory: (directory) => field.onChange(directory) })] });
                } }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: {
                    px: 1
                }, children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `games.${index}.autoSync`, control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(DefaultCheckbox_1.default, { field: field, checked: field.value || false, onChange: (e) => field.onChange(e.target.checked), disabled: disabled, label: "Automatically sync this game?" })) }) })] });
}
//# sourceMappingURL=QuickAddGame.js.map