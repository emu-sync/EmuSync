"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DisplayPlatform;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const OsPlatformLogo_1 = __importDefault(require("@/renderer/components/os-platform/OsPlatformLogo"));
const OsPlatformName_1 = __importDefault(require("@/renderer/components/os-platform/OsPlatformName"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
function DisplayPlatform({ osPlatform }) {
    return (0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, sx: {
            p: 2
        }, component: HorizontalStack_1.default, gap: 2, alignItems: "center", children: [(0, jsx_runtime_1.jsx)(OsPlatformLogo_1.default, { osPlatform: osPlatform }), (0, jsx_runtime_1.jsx)(OsPlatformName_1.default, { osPlatform: osPlatform })] });
}
//# sourceMappingURL=DisplayPlatform.js.map