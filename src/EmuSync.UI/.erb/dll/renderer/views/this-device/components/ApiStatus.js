"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApiStatus;
const jsx_runtime_1 = require("react/jsx-runtime");
const AgentStatusHarness_1 = require("@/renderer/components/harnesses/AgentStatusHarness");
const Section_1 = __importDefault(require("@/renderer/components/Section"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const agent_status_1 = require("@/renderer/state/agent-status");
const MonitorHeart_1 = __importDefault(require("@mui/icons-material/MonitorHeart"));
const jotai_1 = require("jotai");
function ApiStatus() {
    const [agentStatus] = (0, jotai_1.useAtom)(agent_status_1.agentStatusAtom);
    return (0, jsx_runtime_1.jsxs)(Section_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "EmuSync agent status", icon: (0, jsx_runtime_1.jsx)(MonitorHeart_1.default, {}) }), (0, jsx_runtime_1.jsx)(AgentStatusHarness_1.AgentStatusAlert, { running: agentStatus.isRunning })] });
}
//# sourceMappingURL=ApiStatus.js.map