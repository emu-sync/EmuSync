"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DefaultCheckbox;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
function DefaultCheckbox({ field, fieldState, label, disabled, ...props }) {
    return ((0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { control: (0, jsx_runtime_1.jsx)(material_1.Checkbox, { ...field, checked: !!field.value, onChange: (e) => field.onChange(e.target.checked), disabled: disabled, ...props }), label: label }));
}
//# sourceMappingURL=DefaultCheckbox.js.map