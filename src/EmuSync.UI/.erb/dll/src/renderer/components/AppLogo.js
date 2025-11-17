"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppLogo;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const emusync_logo_dark_png_1 = __importDefault(require("@assets/images/emusync-logo-dark.png"));
const emusync_logo_light_png_1 = __importDefault(require("@assets/images/emusync-logo-light.png"));
function AppLogo() {
    const { mode, systemMode } = (0, material_1.useColorScheme)();
    const logo = mode === "dark" || systemMode === "dark" ? emusync_logo_dark_png_1.default : emusync_logo_light_png_1.default;
    return (0, jsx_runtime_1.jsx)("img", { src: logo, alt: "EmuSync logo", style: {
            height: "100%",
            width: "auto",
            padding: "0.65rem"
        } });
}
//# sourceMappingURL=AppLogo.js.map