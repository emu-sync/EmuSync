"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SectionTitle;
const jsx_runtime_1 = require("react/jsx-runtime");
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const material_1 = require("@mui/material");
const WarningAlert_1 = __importDefault(require("@/renderer/components/alerts/WarningAlert"));
function SectionTitle({ title, icon, sectionIsDirty }) {
    return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { sx: { height: 40 }, children: [typeof icon !== "undefined" &&
                (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: icon }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: title }), sectionIsDirty &&
                (0, jsx_runtime_1.jsx)(WarningAlert_1.default, { sx: {
                        ml: "auto",
                        p: 0,
                        px: 1,
                    }, content: "You have unsaved changes" })] });
}
//# sourceMappingURL=SectionTitle.js.map