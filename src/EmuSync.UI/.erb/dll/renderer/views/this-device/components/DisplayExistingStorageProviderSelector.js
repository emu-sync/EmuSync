"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DisplayExistingStorageProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const react_1 = require("react");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const sync_source_api_1 = require("@/renderer/api/sync-source-api");
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const use_alerts_1 = __importDefault(require("@/renderer/hooks/use-alerts"));
const StorageProviderDetails_1 = __importDefault(require("@/renderer/views/this-device/components/StorageProviderDetails"));
const sync_source_utils_1 = require("@/renderer/views/this-device/utils/sync-source-utils");
const react_query_1 = require("@tanstack/react-query");
const ErrorAlert_1 = __importDefault(require("@/renderer/components/alerts/ErrorAlert"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
function DisplayExistingStorageProvider({ provider }) {
    const providerDetails = (0, react_1.useMemo)(() => {
        return sync_source_utils_1.storageProviderMap[provider];
    }, [provider]);
    const { successAlert, errorAlert } = (0, use_alerts_1.default)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const updateMutation = (0, react_query_1.useMutation)({
        mutationFn: sync_source_api_1.unlinkStorageProvider,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [cache_keys_1.cacheKeys.localSyncSource] });
            successAlert("Successfully unlinked provider");
        },
        onError: () => {
            errorAlert("Failed to unlink provider");
        },
    });
    const handleMutation = (0, react_1.useCallback)(() => {
        updateMutation.mutate(false);
    }, [updateMutation]);
    const handleMutationForce = (0, react_1.useCallback)(() => {
        updateMutation.mutate(true);
    }, [updateMutation]);
    const isMutating = updateMutation.isPending;
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, sx: {
                    p: 2
                }, component: HorizontalStack_1.default, justifyContent: "space-between", children: [(0, jsx_runtime_1.jsx)(StorageProviderDetails_1.default, { image: providerDetails.image, name: providerDetails.name, justifyContent: "start" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "error", variant: "contained", disabled: isMutating, loading: isMutating, title: "Unlink this device from the provider", onClick: handleMutation, children: "Unlink" })] }), updateMutation.isError &&
                (0, jsx_runtime_1.jsx)(ErrorAlert_1.default, { action: (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleMutationForce, title: "Force unlink this device from the provider", color: "error", variant: "contained", disabled: isMutating, loading: isMutating, sx: {
                            minWidth: 120
                        }, children: "Force unlink" }), content: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "There may be an issue with the credentials stored on this device for your storage provider. You can force unlink it here." }), (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "I recommend that you force unlink the provider, link to it again, then try unlinking normally again to property clear this device from the storage provider." })] }) })] });
}
//# sourceMappingURL=DisplayExistingStorageProviderSelector.js.map