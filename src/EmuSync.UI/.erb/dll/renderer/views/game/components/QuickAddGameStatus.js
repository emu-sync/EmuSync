"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QuickAddGameStatus;
const jsx_runtime_1 = require("react/jsx-runtime");
const SuccessAlert_1 = __importDefault(require("@/renderer/components/alerts/SuccessAlert"));
const WarningAlert_1 = __importDefault(require("@/renderer/components/alerts/WarningAlert"));
const sx = {
    m: 0,
    py: 0,
    px: 1
};
function QuickAddGameStatus({ existingGame }) {
    if (!existingGame) {
        return (0, jsx_runtime_1.jsx)(SuccessAlert_1.default, { title: "The save file location is the same as the existing game you've selected", content: "A new game will be created", sx: sx });
    }
    return (0, jsx_runtime_1.jsx)(WarningAlert_1.default, { title: "An existing game has been found or selected", content: "An existing game will be updated", sx: sx });
}
//# sourceMappingURL=QuickAddGameStatus.js.map