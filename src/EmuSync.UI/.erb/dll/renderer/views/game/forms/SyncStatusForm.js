"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SyncStatusForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const game_api_1 = require("@/renderer/api/game-api");
const game_sync_api_1 = require("@/renderer/api/game-sync-api");
const ErrorAlert_1 = __importDefault(require("@/renderer/components/alerts/ErrorAlert"));
const WarningAlert_1 = __importDefault(require("@/renderer/components/alerts/WarningAlert"));
const ButtonRow_1 = __importDefault(require("@/renderer/components/buttons/ButtonRow"));
const LoadingHarness_1 = __importDefault(require("@/renderer/components/harnesses/LoadingHarness"));
const Pre_1 = require("@/renderer/components/Pre");
const Section_1 = __importDefault(require("@/renderer/components/Section"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const AlertSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/AlertSkeleton"));
const ButtonSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/ButtonSkeleton"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const use_alerts_1 = __importDefault(require("@/renderer/hooks/use-alerts"));
const use_edit_query_1 = __importDefault(require("@/renderer/hooks/use-edit-query"));
const DisplayGameSyncStatus_1 = __importDefault(require("@/renderer/views/game/components/DisplayGameSyncStatus"));
const RestoreFromBackupModal_1 = __importDefault(require("@/renderer/views/game/components/RestoreFromBackupModal"));
const game_utils_1 = require("@/renderer/views/game/utils/game-utils");
const Sync_1 = __importDefault(require("@mui/icons-material/Sync"));
const material_1 = require("@mui/material");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
;
function SyncStatusForm({ gameId, gameName }) {
    const [backupModalIsOpen, setBackupModalIsOpen] = (0, react_1.useState)(false);
    const { successAlert, errorAlert } = (0, use_alerts_1.default)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const gameLocalSyncLogsKey = (0, react_1.useMemo)(() => {
        return cache_keys_1.cacheKeys.gameLocalSyncLogs(gameId);
    }, [gameId]);
    const gameSyncStatusKey = (0, react_1.useMemo)(() => {
        return cache_keys_1.cacheKeys.gameSyncStatus(gameId);
    }, [gameId]);
    const gameBackupsKey = (0, react_1.useMemo)(() => {
        return cache_keys_1.cacheKeys.gameBackups(gameId);
    }, [gameId]);
    const { query, updateMutation } = (0, use_edit_query_1.default)({
        queryFn: () => (0, game_sync_api_1.getGameSyncStatus)(gameId),
        queryKey: [gameSyncStatusKey],
        relatedQueryKeys: [gameSyncStatusKey, gameBackupsKey, cache_keys_1.cacheKeys.gameList, gameLocalSyncLogsKey],
        mutationFn: game_sync_api_1.syncGame,
        successMessage: () => `Successfully synced game: ${gameName}`,
        errorMessage: () => `Failed to sync game: ${gameName}`,
    });
    const { query: gameBackupsQuery, updateMutation: restoreGameFromBackupMutation } = (0, use_edit_query_1.default)({
        queryFn: () => (0, game_api_1.getGameBackups)(gameId),
        queryKey: [gameBackupsKey],
        relatedQueryKeys: [gameBackupsKey, gameSyncStatusKey, cache_keys_1.cacheKeys.gameList, gameLocalSyncLogsKey],
        mutationFn: async (backupId, context) => {
            return (0, game_sync_api_1.restoreGameFromBackup)(gameId, backupId);
        },
        successMessage: () => `Successfully restored backup for game: ${gameName}`,
        errorMessage: () => `Failed to restore backup for game: ${gameName}`,
    });
    const forceDownloadMutation = (0, react_query_1.useMutation)({
        mutationFn: game_sync_api_1.forceDownloadGame,
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: [gameSyncStatusKey] });
            queryClient.invalidateQueries({ queryKey: [gameBackupsKey] });
            queryClient.invalidateQueries({ queryKey: [gameLocalSyncLogsKey] });
            successAlert(`Successfully downloaded game files for: ${gameName}`);
        },
        onError: async () => {
            errorAlert(`Failed to download game files for: ${gameName} (do you have the game open?)`);
        },
    });
    const forceUploadMutation = (0, react_query_1.useMutation)({
        mutationFn: game_sync_api_1.forceUploadGame,
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: [gameSyncStatusKey] });
            queryClient.invalidateQueries({ queryKey: [gameBackupsKey] });
            queryClient.invalidateQueries({ queryKey: [gameLocalSyncLogsKey] });
            successAlert(`Successfully uploaded game files for: ${gameName}`);
        },
        onError: async () => {
            errorAlert(`Failed to upload game files for: ${gameName} (do you have the game open?)`);
        },
    });
    const handleSyncButtonClick = (0, react_1.useCallback)(() => {
        updateMutation.mutate(gameId);
    }, [gameId]);
    const handleRestoreFromBackup = (0, react_1.useCallback)((backupId) => {
        restoreGameFromBackupMutation.mutate(backupId);
        setBackupModalIsOpen(false);
    }, []);
    const syncState = (0, react_1.useMemo)(() => {
        if (query.data) {
            return (0, game_utils_1.determineGameSyncStatus)(query.data);
        }
        return null;
    }, [query.data]);
    const hasBackups = gameBackupsQuery.data && gameBackupsQuery.data.length > 0;
    return (0, jsx_runtime_1.jsxs)(Section_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "Sync status", icon: (0, jsx_runtime_1.jsx)(Sync_1.default, {}) }), (0, jsx_runtime_1.jsxs)(LoadingHarness_1.default, { query: query, loadingState: (0, jsx_runtime_1.jsx)(LoadingState, {}), children: [query.data ?
                        (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(DisplayGameSyncStatus_1.default, { gameSyncStatus: query.data }), (0, jsx_runtime_1.jsxs)(ButtonRow_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleSyncButtonClick, disabled: query.isFetching || restoreGameFromBackupMutation.isPending || updateMutation.isPending || forceDownloadMutation.isPending || forceUploadMutation.isPending
                                                || syncState === null || syncState.isUpToDate || syncState.localPathIsUnset || (syncState.neverSynced && !syncState.localPathExists), loading: updateMutation.isPending, children: "Sync Now" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "secondary", onClick: () => query.refetch(), disabled: query.isFetching || restoreGameFromBackupMutation.isPending || updateMutation.isPending || forceDownloadMutation.isPending, loading: query.isRefetching, children: "Recheck" })] }), syncState?.requiresDownload === true && syncState.localPathExists &&
                                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(ErrorAlert_1.default, { action: (0, jsx_runtime_1.jsx)(material_1.Button, { color: "error", variant: "contained", size: "small", disabled: query.isFetching || restoreGameFromBackupMutation.isPending || updateMutation.isPending || forceUploadMutation.isPending, loading: forceUploadMutation.isPending, sx: {
                                                        minWidth: 100
                                                    }, children: "Upload" }), content: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { gap: 0.25, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "If you know that the files on this device are newer, you can upload them instead." }), (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Only use this option if you're absolutely sure!" })] }) })] }), syncState?.requiresUpload === true && !syncState.neverSynced &&
                                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(ErrorAlert_1.default, { action: (0, jsx_runtime_1.jsx)(material_1.Button, { color: "error", variant: "contained", size: "small", onClick: () => forceDownloadMutation.mutate(gameId), disabled: query.isFetching || restoreGameFromBackupMutation.isPending || updateMutation.isPending || forceDownloadMutation.isPending || forceUploadMutation.isPending, loading: forceDownloadMutation.isPending, sx: {
                                                        minWidth: 100
                                                    }, children: "Download" }), content: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { gap: 0.25, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "If you know that the files on this device are older, you can download them instead." }), (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Only use this option if you're absolutely sure!" })] }) })] }), hasBackups &&
                                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(WarningAlert_1.default, { action: (0, jsx_runtime_1.jsx)(material_1.Button, { color: "warning", variant: "contained", size: "small", onClick: () => setBackupModalIsOpen(true), disabled: query.isFetching || updateMutation.isPending || forceDownloadMutation.isPending, loading: restoreGameFromBackupMutation.isPending, sx: {
                                                        ml: 1,
                                                        minWidth: 150
                                                    }, children: "Choose a backup" }), content: (0, jsx_runtime_1.jsx)(VerticalStack_1.default, { children: (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["This game has ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: gameBackupsQuery.data.length }), " local backup", gameBackupsQuery.data.length > 1 ? "s" : "", " you can restore from. Restoring from a backup will overwrite the local game save files, then upload them as the latest files."] }) }) })] })] })
                        :
                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), (0, jsx_runtime_1.jsx)(RestoreFromBackupModal_1.default, { backups: gameBackupsQuery.data ?? [], isOpen: backupModalIsOpen, setIsOpen: setBackupModalIsOpen, onSelectBackup: handleRestoreFromBackup })] })] });
}
function LoadingState() {
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(AlertSkeleton_1.default, {}), (0, jsx_runtime_1.jsxs)(ButtonRow_1.default, { children: [(0, jsx_runtime_1.jsx)(ButtonSkeleton_1.default, { width: 100 }), (0, jsx_runtime_1.jsx)(ButtonSkeleton_1.default, { width: 91 })] })] });
}
//# sourceMappingURL=SyncStatusForm.js.map