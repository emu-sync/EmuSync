"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StorageProviderForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const sync_source_api_1 = require("@/renderer/api/sync-source-api");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const material_1 = require("@mui/material");
const react_1 = require("react");
const LoadingHarness_1 = __importDefault(require("@/renderer/components/LoadingHarness"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const DisplayExistingStorageProviderSelector_1 = __importDefault(require("@/renderer/views/this-device/components/DisplayExistingStorageProviderSelector"));
const StorageProviderSelector_1 = __importDefault(require("@/renderer/views/this-device/components/StorageProviderSelector"));
const Backup_1 = __importDefault(require("@mui/icons-material/Backup"));
const react_query_1 = require("@tanstack/react-query");
function StorageProviderForm() {
    const queryClient = (0, react_query_1.useQueryClient)();
    const query = (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.localSyncSource],
        queryFn: sync_source_api_1.getLocalSyncSource
    });
    const handleConnectedProvider = (0, react_1.useCallback)(() => {
        [cache_keys_1.cacheKeys.localSyncSource, cache_keys_1.cacheKeys.allSyncSources].forEach(key => {
            queryClient.invalidateQueries({ queryKey: [key] });
        });
        query.refetch();
    }, []);
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "Storage provider", icon: (0, jsx_runtime_1.jsx)(Backup_1.default, {}) }), (0, jsx_runtime_1.jsx)(LoadingHarness_1.default, { query: query, loadingState: (0, jsx_runtime_1.jsx)(LoadingState, {}), children: 
                //has storage provider?
                query.data && query.data.storageProviderId ?
                    (0, jsx_runtime_1.jsx)(DisplayExistingStorageProviderSelector_1.default, { provider: query.data.storageProviderId })
                    :
                        (0, jsx_runtime_1.jsx)(StorageProviderSelector_1.default, { onConnected: handleConnectedProvider }) })] });
}
function LoadingState() {
    return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Loading provider details..." }), (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 16 })] });
}
//# sourceMappingURL=StorageProviderForm.js.map