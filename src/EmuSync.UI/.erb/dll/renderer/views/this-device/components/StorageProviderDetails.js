"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StorageProviderDetails;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const system_1 = require("@mui/system");
function StorageProviderDetails({ image, name, direction, justifyContent }) {
    return (0, jsx_runtime_1.jsxs)(system_1.Stack, { gap: 2, alignItems: "center", direction: direction ?? "row", justifyContent: (justifyContent ?? "center"), children: [(0, jsx_runtime_1.jsx)("img", { src: image, alt: "Provider logo", style: {
                    height: 25,
                    width: "auto"
                } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { children: name })] });
}
//# sourceMappingURL=StorageProviderDetails.js.map