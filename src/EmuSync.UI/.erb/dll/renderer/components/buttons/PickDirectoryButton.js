"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PickDirectoryButton;
const jsx_runtime_1 = require("react/jsx-runtime");
const FolderOpen_1 = __importDefault(require("@mui/icons-material/FolderOpen"));
const material_1 = require("@mui/material");
const react_1 = require("react");
function PickDirectoryButton({ disabled, defaultPath, onPickDirectory }) {
    const handlePick = (0, react_1.useCallback)(async () => {
        const path = await window.electron.openDirectory(defaultPath);
        const pathToUse = path ?? "";
        if (path) {
            onPickDirectory(pathToUse);
        }
    }, [defaultPath]);
    return (0, jsx_runtime_1.jsx)(material_1.IconButton, { color: "primary", title: "Pick a directory", disabled: disabled, onClick: handlePick, children: (0, jsx_runtime_1.jsx)(FolderOpen_1.default, {}) });
}
//# sourceMappingURL=PickDirectoryButton.js.map