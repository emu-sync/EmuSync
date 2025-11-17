"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AgentStatusHarness;
exports.AgentStatusLoadingState = AgentStatusLoadingState;
exports.AgentStatusAlert = AgentStatusAlert;
const jsx_runtime_1 = require("react/jsx-runtime");
const ErrorAlert_1 = __importDefault(require("@/renderer/components/alerts/ErrorAlert"));
const SuccessAlert_1 = __importDefault(require("@/renderer/components/alerts/SuccessAlert"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const material_1 = require("@mui/material");
function AgentStatusHarness({ agentStatus, children }) {
    if (!agentStatus.hasChecked) {
        return (0, jsx_runtime_1.jsx)(AgentStatusLoadingState, {});
    }
    if (!agentStatus.isRunning) {
        return (0, jsx_runtime_1.jsx)(AgentStatusAlert, { running: false });
    }
    return children;
}
function AgentStatusLoadingState() {
    return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Checking agent status..." }), (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 16 })] });
}
function AgentStatusAlert({ running }) {
    if (!running) {
        return (0, jsx_runtime_1.jsx)(ErrorAlert_1.default, { content: "The EmuSync agent is not running." });
    }
    return (0, jsx_runtime_1.jsx)(SuccessAlert_1.default, { content: "The EmuSync agent is running." });
}
//# sourceMappingURL=AgentStatusHarness.js.map