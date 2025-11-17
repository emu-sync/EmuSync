"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AboutScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const system_info_api_1 = require("@/renderer/api/system-info-api");
const InfoAlert_1 = __importDefault(require("@/renderer/components/alerts/InfoAlert"));
const ButtonRow_1 = __importDefault(require("@/renderer/components/buttons/ButtonRow"));
const Container_1 = __importDefault(require("@/renderer/components/Container"));
const Pre_1 = require("@/renderer/components/Pre");
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const routes_1 = require("@/renderer/routes");
const agent_status_1 = require("@/renderer/state/agent-status");
const material_1 = require("@mui/material");
const react_query_1 = require("@tanstack/react-query");
const jotai_1 = require("jotai");
const Icon = routes_1.routes.about.icon;
function AboutScreen() {
    const [agentStatus] = (0, jotai_1.useAtom)(agent_status_1.agentStatusAtom);
    const agentInfoQuery = (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.agentSystemInfo],
        queryFn: system_info_api_1.getAgentSystemInfo
    });
    return (0, jsx_runtime_1.jsx)(Container_1.default, { children: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "About EmuSync", icon: (0, jsx_runtime_1.jsx)(Icon, {}) }), (0, jsx_runtime_1.jsx)(InfoAlert_1.default, { content: (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["You are running version ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: window.electron.releaseVersion }), " of EmuSync."] }) }), (0, jsx_runtime_1.jsx)(ButtonRow_1.default, { children: (0, jsx_runtime_1.jsx)(material_1.Button, { color: "primary", variant: "contained", disabled: agentInfoQuery.isFetching || !agentStatus.isRunning, children: "Check for updates (TODO)" }) })] }) });
}
function AgentInfoLoadingState() {
    return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Checking agent info..." }), (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 16 })] });
}
//# sourceMappingURL=AboutScreen.js.map