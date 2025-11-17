"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CheckboxSkeleton;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
function CheckboxSkeleton({ width }) {
    return (0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { control: (0, jsx_runtime_1.jsx)(material_1.Checkbox, { disabled: true }), label: (0, jsx_runtime_1.jsx)(material_1.Skeleton, { variant: "text", width: width, height: 40 }) });
}
//# sourceMappingURL=CheckboxSkeleton.js.map