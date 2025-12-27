"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pre = Pre;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
function Pre({ children }) {
    return ((0, jsx_runtime_1.jsx)(material_1.Typography, { sx: {
            position: "relative",
            display: "inline",
            padding: "0.5px",
            fontFamily: "monospace",
            overflow: "hidden",
            mx: "1px",
            px: "4px",
            background: "rgb(140,140,140, .10)",
            borderRadius: "5px"
        }, component: "span", children: children }));
}
//# sourceMappingURL=Pre.js.map