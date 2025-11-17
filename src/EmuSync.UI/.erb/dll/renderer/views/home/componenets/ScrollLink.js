"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScrollLink;
const jsx_runtime_1 = require("react/jsx-runtime");
const Pre_1 = require("@/renderer/components/Pre");
const material_1 = require("@mui/material");
function ScrollLink({ children, scrollRef }) {
    const scrollTo = () => {
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    };
    return (0, jsx_runtime_1.jsx)(material_1.Button, { sx: {
            p: 0,
            m: 0,
            minWidth: 0,
            width: "auto"
        }, onClick: scrollTo, children: (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: children }) });
}
//# sourceMappingURL=ScrollLink.js.map