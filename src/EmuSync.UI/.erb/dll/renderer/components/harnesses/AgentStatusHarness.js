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
const WarningAlert_1 = __importDefault(require("@/renderer/components/alerts/WarningAlert"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const routes_1 = require("@/renderer/routes");
const agent_status_1 = require("@/renderer/state/agent-status");
const local_sync_source_1 = require("@/renderer/state/local-sync-source");
const material_1 = require("@mui/material");
const jotai_1 = require("jotai");
const react_router_dom_1 = require("react-router-dom");
function AgentStatusHarness({ children }) {
    const [agentStatus] = (0, jotai_1.useAtom)(agent_status_1.agentStatusAtom);
    const [localSyncSource] = (0, jotai_1.useAtom)(local_sync_source_1.localSyncSourceAtom);
    if (!agentStatus.hasChecked) {
        return (0, jsx_runtime_1.jsx)(AgentStatusLoadingState, {});
    }
    if (!agentStatus.isRunning) {
        return (0, jsx_runtime_1.jsx)(AgentStatusAlert, { running: false });
    }
    if (!(localSyncSource.storageProviderId)) {
        return (0, jsx_runtime_1.jsx)(WarningAlert_1.default, { content: (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["You need to configure a storage provider in the ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: routes_1.routes.thisDevice.href, children: routes_1.routes.thisDevice.title }), " section first."] }) });
    }
    return children;
}
function AgentStatusLoadingState() {
    return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Checking agent status..." }), (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 16 })] });
}
function AgentStatusAlert({ running }) {
    if (!running) {
        return (0, jsx_runtime_1.jsx)(ErrorAlert_1.default, { content: "The EmuSync agent is not running on this device." });
    }
    return (0, jsx_runtime_1.jsx)(SuccessAlert_1.default, { content: "The EmuSync agent is running on this device." });
}
//# sourceMappingURL=AgentStatusHarness.js.map