"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DividerWord;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
function DividerWord({ word }) {
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { display: "flex", alignItems: "center", width: "100%", children: [(0, jsx_runtime_1.jsx)(material_1.Box, { flex: "1", height: 2, bgcolor: "divider" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { sx: { mx: 1 }, color: "text.secondary", variant: "body2", children: word }), (0, jsx_runtime_1.jsx)(material_1.Box, { flex: "1", height: 2, bgcolor: "divider" })] }));
}
//# sourceMappingURL=DividerWord.js.map