"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinkButton;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const react_router_dom_1 = require("react-router-dom");
function LinkButton({ href, title, disabled, buttonSx, buttonStartIcon, buttonSize, variant, children }) {
    return (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: href, title: title, style: { color: "inherit", textDecoration: "none", pointerEvents: disabled ? "none" : "unset" }, children: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: variant ?? "text", startIcon: buttonStartIcon, sx: buttonSx, disabled: disabled, size: buttonSize, children: children }) });
}
//# sourceMappingURL=LinkButton.js.map