"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameScanForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const sync_source_api_1 = require("@/renderer/api/sync-source-api");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const material_1 = require("@mui/material");
const LoadingHarness_1 = __importDefault(require("@/renderer/components/harnesses/LoadingHarness"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const use_edit_query_1 = __importDefault(require("@/renderer/hooks/use-edit-query"));
const Radar_1 = __importDefault(require("@mui/icons-material/Radar"));
const react_1 = require("react");
const TimeAgo_1 = __importDefault(require("@/renderer/components/dates/TimeAgo"));
const LinearProgressWithLabel_1 = __importDefault(require("@/renderer/views/this-device/components/LinearProgressWithLabel"));
const ExternalLinkButton_1 = __importDefault(require("@/renderer/components/buttons/ExternalLinkButton"));
const Pre_1 = require("@/renderer/components/Pre");
function GameScanForm() {
    const { query, updateMutation } = (0, use_edit_query_1.default)({
        queryFn: sync_source_api_1.getGameScanDetails,
        queryKey: [cache_keys_1.cacheKeys.gameScanDetails],
        relatedQueryKeys: [cache_keys_1.cacheKeys.gameScanDetails],
        mutationFn: sync_source_api_1.forceGameScan,
        disableAlerts: true
    });
    const handleMutation = (0, react_1.useCallback)(() => {
        updateMutation.mutate(undefined);
    }, [updateMutation]);
    const isInProgress = query.data?.inProgress ?? false;
    (0, react_1.useEffect)(() => {
        if (!isInProgress)
            return;
        const interval = setInterval(() => {
            query.refetch();
        }, 200);
        return () => clearInterval(interval);
    }, [isInProgress]);
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "Game save detection", icon: (0, jsx_runtime_1.jsx)(Radar_1.default, {}) }), (0, jsx_runtime_1.jsxs)(LoadingHarness_1.default, { query: query, loadingState: (0, jsx_runtime_1.jsx)(LoadingState, {}), children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["EmuSync uses the ", (0, jsx_runtime_1.jsx)(ExternalLinkButton_1.default, { href: "https://github.com/mtkennerly/ludusavi-manifest", text: "Ludusavi Manifest" }), " to detect game saves on your device. If some of your games saves aren't detected, it might not be in the manifest yet. If it's in the manifest, but not being detected by EmuSync, and you're sure the data exists, pleae raise an issue in ", (0, jsx_runtime_1.jsx)(ExternalLinkButton_1.default, { href: "https://github.com/emu-sync/EmuSync/issues", text: "issues" }), " page."] }), (0, jsx_runtime_1.jsx)(material_1.Paper, { elevation: 3, sx: {
                            p: 2,
                            height: 72
                        }, component: HorizontalStack_1.default, justifyContent: "space-between", children: isInProgress ?
                            (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(LinearProgressWithLabel_1.default, { value: query.data?.progressPercent ?? 0 }) })
                            :
                                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["The last game scan was ", (0, jsx_runtime_1.jsx)(TimeAgo_1.default, { secondsAgo: query.data?.lastScanSeconds ?? 0 }), " and found ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: query.data?.countOfGames }), " games."] }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "primary", variant: "contained", disabled: updateMutation.isPending, loading: updateMutation.isPending, onClick: handleMutation, sx: {
                                                minWidth: 100
                                            }, children: "Scan now" })] }) })] })] });
}
function LoadingState() {
    return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Loading game scan details..." }), (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 16 })] });
}
//# sourceMappingURL=GameScanForm.js.map