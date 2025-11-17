"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DefaultTextField;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
function DefaultTextField({ field, fieldState, ...props }) {
    return (0, jsx_runtime_1.jsx)(material_1.TextField, { ...field, error: !!fieldState?.error, helperText: fieldState?.error?.message, variant: "outlined", fullWidth: true, slotProps: {
            inputLabel: {
                shrink: true,
            },
        }, ...props });
}
//# sourceMappingURL=DefaultTextField.js.map