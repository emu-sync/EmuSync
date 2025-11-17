"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ButtonRow;
const jsx_runtime_1 = require("react/jsx-runtime");
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
function ButtonRow({ children }) {
    return (0, jsx_runtime_1.jsx)(HorizontalStack_1.default, { gap: 1, children: children });
}
//# sourceMappingURL=ButtonRow.js.map