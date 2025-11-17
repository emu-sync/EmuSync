"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SyncStatusForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const game_sync_api_1 = require("@/renderer/api/game-sync-api");
const ErrorAlert_1 = __importDefault(require("@/renderer/components/alerts/ErrorAlert"));
const ButtonRow_1 = __importDefault(require("@/renderer/components/buttons/ButtonRow"));
const LoadingHarness_1 = __importDefault(require("@/renderer/components/LoadingHarness"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const AlertSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/AlertSkeleton"));
const ButtonSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/ButtonSkeleton"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const use_alerts_1 = __importDefault(require("@/renderer/hooks/use-alerts"));
const use_edit_query_1 = __importDefault(require("@/renderer/hooks/use-edit-query"));
const DisplayGameSyncStatus_1 = __importDefault(require("@/renderer/views/game/components/DisplayGameSyncStatus"));
const game_utils_1 = require("@/renderer/views/game/utils/game-utils");
const Sync_1 = __importDefault(require("@mui/icons-material/Sync"));
const material_1 = require("@mui/material");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
;
function SyncStatusForm({ gameId }) {
    const { successAlert, errorAlert } = (0, use_alerts_1.default)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const gameSyncStatusKey = (0, react_1.useMemo)(() => {
        return cache_keys_1.cacheKeys.gameSyncStatus(gameId);
    }, [gameId]);
    const { query, updateMutation } = (0, use_edit_query_1.default)({
        queryFn: () => (0, game_sync_api_1.getGameSyncStatus)(gameId),
        queryKey: [gameSyncStatusKey],
        relatedQueryKeys: [gameSyncStatusKey],
        mutationFn: game_sync_api_1.syncGame,
        successMessage: "Game successfully synced",
        errorMessage: "Failed to sync game"
    });
    const forceDownloadMutation = (0, react_query_1.useMutation)({
        mutationFn: game_sync_api_1.forceDownloadGame,
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: [gameSyncStatusKey] });
            successAlert("Successfully downloaded game files");
        },
        onError: async () => {
            errorAlert("Failed to download game files");
        },
    });
    const forceUploadMutation = (0, react_query_1.useMutation)({
        mutationFn: game_sync_api_1.forceUploadGame,
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: [gameSyncStatusKey] });
            successAlert("Successfully uploaded game files");
        },
        onError: async () => {
            errorAlert("Failed to upload game files");
        },
    });
    const handleSyncButtonClick = (0, react_1.useCallback)(() => {
        updateMutation.mutate(gameId);
    }, [gameId]);
    const syncState = (0, react_1.useMemo)(() => {
        if (query.data) {
            return (0, game_utils_1.determineGameSyncStatus)(query.data);
        }
        return null;
    }, [query.data]);
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "Sync status", icon: (0, jsx_runtime_1.jsx)(Sync_1.default, {}) }), (0, jsx_runtime_1.jsx)(LoadingHarness_1.default, { query: query, loadingState: (0, jsx_runtime_1.jsx)(LoadingState, {}), children: query.data ?
                    (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(DisplayGameSyncStatus_1.default, { gameSyncStatus: query.data }), (0, jsx_runtime_1.jsxs)(ButtonRow_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleSyncButtonClick, disabled: query.isFetching || updateMutation.isPending || forceDownloadMutation.isPending || forceUploadMutation.isPending
                                            || syncState === null || syncState.isUpToDate || syncState.localPathIsUnset || (syncState.neverSynced && !syncState.localPathExists), loading: updateMutation.isPending, children: "Sync Now" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "secondary", onClick: () => query.refetch(), disabled: query.isFetching || updateMutation.isPending || forceDownloadMutation.isPending, loading: query.isRefetching, children: "Recheck" })] }), syncState?.requiresDownload === true && syncState.localPathExists &&
                                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(ErrorAlert_1.default, { action: (0, jsx_runtime_1.jsx)(material_1.Button, { color: "error", variant: "contained", disabled: query.isFetching || updateMutation.isPending || forceUploadMutation.isPending, loading: forceUploadMutation.isPending, children: "Upload" }), content: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "If you know that the files on this device are newer, you can upload them instead." }), (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Only use this option if you're absolutely sure!" })] }) })] }), syncState?.requiresUpload === true &&
                                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(ErrorAlert_1.default, { action: (0, jsx_runtime_1.jsx)(material_1.Button, { color: "error", variant: "contained", onClick: () => forceDownloadMutation.mutate(gameId), disabled: query.isFetching || updateMutation.isPending || forceDownloadMutation.isPending, loading: forceDownloadMutation.isPending, children: "Download" }), content: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "If you know that the files on this device are older, you can download them instead." }), (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Only use this option if you're absolutely sure!" })] }) })] })] })
                    :
                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}) })] });
}
function LoadingState() {
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(AlertSkeleton_1.default, {}), (0, jsx_runtime_1.jsxs)(ButtonRow_1.default, { children: [(0, jsx_runtime_1.jsx)(ButtonSkeleton_1.default, { width: 100 }), (0, jsx_runtime_1.jsx)(ButtonSkeleton_1.default, { width: 91 })] })] });
}
//# sourceMappingURL=SyncStatusForm.js.map