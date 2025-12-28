"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LinearProgressWithLabel;
const jsx_runtime_1 = require("react/jsx-runtime");
const LinearProgress_1 = __importDefault(require("@mui/material/LinearProgress"));
const Typography_1 = __importDefault(require("@mui/material/Typography"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
function LinearProgressWithLabel(props) {
    return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(Box_1.default, { sx: { width: '100%', mr: 1 }, children: (0, jsx_runtime_1.jsx)(LinearProgress_1.default, { variant: "determinate", ...props }) }), (0, jsx_runtime_1.jsx)(Box_1.default, { sx: { minWidth: 35 }, children: (0, jsx_runtime_1.jsx)(Typography_1.default, { variant: "body2", sx: { color: 'text.secondary' }, children: `${props.value}%` }) })] });
}
//# sourceMappingURL=LinearProgressWithLabel.js.map