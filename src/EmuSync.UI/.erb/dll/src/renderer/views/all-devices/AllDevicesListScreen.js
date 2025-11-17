"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AllDevicesListScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const sync_source_api_1 = require("@/renderer/api/sync-source-api");
const AgentStatusHarness_1 = __importDefault(require("@/renderer/components/AgentStatusHarness"));
const WarningAlert_1 = __importDefault(require("@/renderer/components/alerts/WarningAlert"));
const Container_1 = __importDefault(require("@/renderer/components/Container"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const use_list_query_1 = __importDefault(require("@/renderer/hooks/use-list-query"));
const routes_1 = require("@/renderer/routes");
const agent_status_1 = require("@/renderer/state/agent-status");
const local_sync_source_1 = require("@/renderer/state/local-sync-source");
const DeviceList_1 = __importDefault(require("@/renderer/views/all-devices/components/DeviceList"));
const material_1 = require("@mui/material");
const jotai_1 = require("jotai");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Icon = routes_1.routes.allDevices.icon;
function AllDevicesListScreen() {
    const [localSyncSource] = (0, jotai_1.useAtom)(local_sync_source_1.localSyncSourceAtom);
    const [agentStatus] = (0, jotai_1.useAtom)(agent_status_1.agentStatusAtom);
    const { query, deleteMutation } = (0, use_list_query_1.default)({
        queryFn: sync_source_api_1.getSyncSourceList,
        queryKey: [cache_keys_1.cacheKeys.allSyncSources],
        relatedQueryKeys: [cache_keys_1.cacheKeys.allSyncSources, cache_keys_1.cacheKeys.localSyncSource],
        mutationFn: sync_source_api_1.deleteSyncSource
    });
    const handleDelete = (0, react_1.useCallback)((id) => {
        return deleteMutation.mutateAsync(id);
    }, [deleteMutation]);
    return (0, jsx_runtime_1.jsx)(Container_1.default, { children: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: routes_1.routes.allDevices.title, icon: (0, jsx_runtime_1.jsx)(Icon, {}) }), (0, jsx_runtime_1.jsx)(AgentStatusHarness_1.default, { agentStatus: agentStatus, children: localSyncSource.storageProviderId ?
                        (0, jsx_runtime_1.jsx)(DeviceList_1.default, { thisDeviceId: localSyncSource.id, query: query, onDelete: handleDelete })
                        :
                            (0, jsx_runtime_1.jsx)(WarningAlert_1.default, { content: (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["You need to configure a storage provider in the ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: routes_1.routes.thisDevice.href, children: routes_1.routes.thisDevice.title }), " section before you can manage devices."] }) }) })] }) });
}
//# sourceMappingURL=AllDevicesListScreen.js.map