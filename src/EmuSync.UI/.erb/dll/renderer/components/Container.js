"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Container;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
function Container({ children }) {
    return (0, jsx_runtime_1.jsx)(material_1.Paper, { sx: {
            margin: "auto",
            maxWidth: {
                xs: "unset",
                lg: "50%"
            },
            minWidth: {
                xs: "100%",
                lg: 650,
                xl: 800,
            },
            p: 2
        }, elevation: 2, children: children });
}
//# sourceMappingURL=Container.js.map