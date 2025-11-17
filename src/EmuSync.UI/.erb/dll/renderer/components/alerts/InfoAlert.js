"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InfoAlert;
const jsx_runtime_1 = require("react/jsx-runtime");
const BaseAlert_1 = __importDefault(require("@/renderer/components/alerts/BaseAlert"));
function InfoAlert({ content, ...alertProps }) {
    return (0, jsx_runtime_1.jsx)(BaseAlert_1.default, { severity: "info", content: content, ...alertProps });
}
//# sourceMappingURL=InfoAlert.js.map