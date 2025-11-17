"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HorizontalStack;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
function HorizontalStack(props) {
    const { children, sx, gap, ...stackProps } = props;
    const mergedSx = {
        width: "100%",
        ...sx
    };
    return (0, jsx_runtime_1.jsx)(material_1.Stack, { ...stackProps, direction: "row", alignItems: "center", gap: gap ?? 2, sx: mergedSx, children: children });
}
//# sourceMappingURL=HorizontalStack.js.map