"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VerticalStack;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
function VerticalStack(props) {
    const { children, gap, ...stackProps } = props;
    return (0, jsx_runtime_1.jsx)(material_1.Stack, { ...stackProps, gap: gap ?? 2.5, children: children });
}
//# sourceMappingURL=VerticalStack.js.map