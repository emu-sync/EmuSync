"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReadmeList;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
function ReadmeList({ list, listStyle }) {
    return (0, jsx_runtime_1.jsx)(material_1.List, { dense: true, disablePadding: true, sx: {
            listStyleType: listStyle,
            paddingInlineStart: 2.5
        }, children: list.map((listItem, index) => {
            return (0, jsx_runtime_1.jsx)(material_1.ListItem, { sx: { display: "list-item" }, children: listItem }, index);
        }) });
}
//# sourceMappingURL=ReadmeList.js.map