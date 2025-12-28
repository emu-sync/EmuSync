"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DisplayGameSyncStatus;
const jsx_runtime_1 = require("react/jsx-runtime");
const ErrorAlert_1 = __importDefault(require("@/renderer/components/alerts/ErrorAlert"));
const InfoAlert_1 = __importDefault(require("@/renderer/components/alerts/InfoAlert"));
const SuccessAlert_1 = __importDefault(require("@/renderer/components/alerts/SuccessAlert"));
const WarningAlert_1 = __importDefault(require("@/renderer/components/alerts/WarningAlert"));
const StorageSizeChip_1 = __importDefault(require("@/renderer/components/chips/StorageSizeChip"));
const DisplayDate_1 = __importDefault(require("@/renderer/components/dates/DisplayDate"));
const Pre_1 = require("@/renderer/components/Pre");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const use_sync_source_mapper_1 = __importDefault(require("@/renderer/hooks/use-sync-source-mapper"));
const game_utils_1 = require("@/renderer/views/game/utils/game-utils");
const material_1 = require("@mui/material");
const react_1 = require("react");
function DisplayGameSyncStatus({ gameSyncStatus }) {
    const { mapSyncSource } = (0, use_sync_source_mapper_1.default)();
    const lastSyncSourceName = (0, react_1.useMemo)(() => {
        const source = mapSyncSource(gameSyncStatus.lastSyncedFrom ?? "");
        if (!source)
            return "Unknown device";
        return source.name;
    }, [gameSyncStatus, mapSyncSource]);
    const AlertMemo = (0, react_1.useMemo)(() => {
        const lastSyncExists = !!(gameSyncStatus.lastSyncedFrom);
        const syncState = (0, game_utils_1.determineGameSyncStatus)(gameSyncStatus);
        if (syncState.localPathIsUnset) {
            return (0, jsx_runtime_1.jsx)(ErrorAlert_1.default, { content: "A sync location must be set for this device." });
        }
        if (syncState.neverSynced) {
            let message = "This game hasn't been uploaded from any device yet";
            if (!syncState.localPathExists) {
                message += " - a valid sync location must be set for this device";
            }
            message += ".";
            return (0, jsx_runtime_1.jsx)(WarningAlert_1.default, { content: message });
        }
        const displayDate = (0, jsx_runtime_1.jsx)(DisplayDate_1.default, { date: gameSyncStatus.lastSyncedAtUtc, displayAsFromNow: true });
        const displayFullDate = (0, jsx_runtime_1.jsx)(DisplayDate_1.default, { date: gameSyncStatus.lastSyncedAtUtc, format: "DD/MM/YYYY HH:mm:ss" });
        const storageChip = (0, jsx_runtime_1.jsx)(StorageSizeChip_1.default, { bytes: gameSyncStatus.storageBytes });
        const lastSync = lastSyncExists ?
            (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["Game files were last uploaded from ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: lastSyncSourceName }), " ", displayDate, " at ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: displayFullDate }), "."] })
            : undefined;
        if (syncState.requiresUpload) {
            return (0, jsx_runtime_1.jsx)(InfoAlert_1.default, { action: storageChip, content: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Game files are newer and require uploading." }), lastSync] }) });
        }
        if (syncState.requiresDownload) {
            return (0, jsx_runtime_1.jsx)(WarningAlert_1.default, { action: storageChip, content: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Game files are out of date and require downloading." }), lastSync] }) });
        }
        return (0, jsx_runtime_1.jsx)(SuccessAlert_1.default, { action: storageChip, content: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Game files are up to date on this device." }), lastSync] }) });
    }, [gameSyncStatus, lastSyncSourceName]);
    return (0, jsx_runtime_1.jsx)(VerticalStack_1.default, { children: AlertMemo });
}
//# sourceMappingURL=DisplayGameSyncStatus.js.map