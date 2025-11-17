"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FAQ;
const jsx_runtime_1 = require("react/jsx-runtime");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const material_1 = require("@mui/material");
function FAQ({ title, children }) {
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { gap: 1, sx: {
            my: 1
        }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { sx: {
                    fontWeight: "bold",
                    fontSize: "1rem"
                }, children: title }), children] });
}
//# sourceMappingURL=FAQ.js.map