"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DefaultAutoComplete;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
function DefaultAutoComplete({ field, fieldState, label, placeholder, ...props }) {
    return (0, jsx_runtime_1.jsx)(material_1.Autocomplete, { ...props, value: field.value ?? null, onChange: (_, value) => field.onChange(value), renderInput: (params) => ((0, jsx_runtime_1.jsx)(material_1.TextField, { ...params, label: label, error: !!fieldState?.error, helperText: fieldState?.error?.message, variant: "outlined", fullWidth: true, placeholder: placeholder, slotProps: {
                inputLabel: {
                    shrink: true,
                }
            } })) });
}
//# sourceMappingURL=DefaultAutoComplete.js.map