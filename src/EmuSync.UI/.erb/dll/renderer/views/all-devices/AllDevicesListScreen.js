"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AllDevicesListScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const sync_source_api_1 = require("@/renderer/api/sync-source-api");
const Container_1 = __importDefault(require("@/renderer/components/Container"));
const AgentStatusHarness_1 = __importDefault(require("@/renderer/components/harnesses/AgentStatusHarness"));
const Section_1 = __importDefault(require("@/renderer/components/Section"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const use_list_query_1 = __importDefault(require("@/renderer/hooks/use-list-query"));
const routes_1 = require("@/renderer/routes");
const local_sync_source_1 = require("@/renderer/state/local-sync-source");
const DeviceList_1 = __importDefault(require("@/renderer/views/all-devices/components/DeviceList"));
const jotai_1 = require("jotai");
const react_1 = require("react");
const Icon = routes_1.routes.allDevices.icon;
function AllDevicesListScreen() {
    const [localSyncSource] = (0, jotai_1.useAtom)(local_sync_source_1.localSyncSourceAtom);
    const { query, deleteMutation } = (0, use_list_query_1.default)({
        queryFn: sync_source_api_1.getSyncSourceList,
        queryKey: [cache_keys_1.cacheKeys.allSyncSources],
        relatedQueryKeys: [cache_keys_1.cacheKeys.allSyncSources, cache_keys_1.cacheKeys.localSyncSource],
        mutationFn: sync_source_api_1.deleteSyncSource,
        resetCacheFn: async () => { }
    });
    const handleDelete = (0, react_1.useCallback)((id) => {
        return deleteMutation.mutateAsync(id);
    }, [deleteMutation]);
    return (0, jsx_runtime_1.jsx)(Container_1.default, { children: (0, jsx_runtime_1.jsxs)(Section_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: routes_1.routes.allDevices.title, icon: (0, jsx_runtime_1.jsx)(Icon, {}) }), (0, jsx_runtime_1.jsx)(AgentStatusHarness_1.default, { children: (0, jsx_runtime_1.jsx)(DeviceList_1.default, { thisDeviceId: localSyncSource.id, query: query, onDelete: handleDelete }) })] }) });
}
//# sourceMappingURL=AllDevicesListScreen.js.map