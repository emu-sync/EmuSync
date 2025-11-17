"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseAlert;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const react_1 = require("react");
function BaseAlert({ severity, content, ...alertProps }) {
    const alertContent = (0, react_1.useMemo)(() => {
        if (typeof content === "string") {
            return (0, jsx_runtime_1.jsx)(material_1.Typography, { children: content });
        }
        return content;
    }, [content]);
    return (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: severity, ...alertProps, children: alertContent });
}
//# sourceMappingURL=BaseAlert.js.map