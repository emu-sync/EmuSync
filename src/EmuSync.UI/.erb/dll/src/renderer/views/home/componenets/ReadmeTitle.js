"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReadmeTitle;
const jsx_runtime_1 = require("react/jsx-runtime");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const material_1 = require("@mui/material");
function ReadmeTitle({ title, scrollRef }) {
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { gap: 1, ref: scrollRef, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", children: title }), (0, jsx_runtime_1.jsx)(material_1.Divider, {})] });
}
//# sourceMappingURL=ReadmeTitle.js.map