"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApiStatus;
const jsx_runtime_1 = require("react/jsx-runtime");
const AgentStatusHarness_1 = __importStar(require("@/renderer/components/AgentStatusHarness"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const agent_status_1 = require("@/renderer/state/agent-status");
const MonitorHeart_1 = __importDefault(require("@mui/icons-material/MonitorHeart"));
const jotai_1 = require("jotai");
function ApiStatus() {
    const [agentStatus] = (0, jotai_1.useAtom)(agent_status_1.agentStatusAtom);
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "EmuSync agent status", icon: (0, jsx_runtime_1.jsx)(MonitorHeart_1.default, {}) }), (0, jsx_runtime_1.jsx)(AgentStatusHarness_1.default, { agentStatus: agentStatus, children: (0, jsx_runtime_1.jsx)(AgentStatusHarness_1.AgentStatusAlert, { running: true }) })] });
}
//# sourceMappingURL=ApiStatus.js.map