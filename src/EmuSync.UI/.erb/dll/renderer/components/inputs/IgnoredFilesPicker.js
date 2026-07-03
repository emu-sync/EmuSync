"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IgnoredFilesPicker;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const game_api_1 = require("@/renderer/api/game-api");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const material_1 = require("@mui/material");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
;
function IgnoredFilesPicker({ gameId, syncSourceId, folderPath, value, onChange, disabled }) {
    const query = (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.gameSaveFiles(gameId), folderPath],
        queryFn: () => (0, game_api_1.getGameSaveFiles)(gameId, syncSourceId),
        enabled: !!folderPath
    });
    const ignoredPaths = (0, react_1.useMemo)(() => value ?? [], [value]);
    //merge the on-disk file list with the saved ignore list, so entries
    //that no longer exist locally can still be seen and unticked
    const rows = (0, react_1.useMemo)(() => {
        const files = query.data ?? [];
        const onDisk = new Set(files.map(f => f.relativePath.toLowerCase()));
        const merged = files.map(f => ({
            relativePath: f.relativePath,
            isIgnored: ignoredPaths.some(p => p.toLowerCase() === f.relativePath.toLowerCase()),
            isMissing: false
        }));
        for (const ignored of ignoredPaths) {
            if (!onDisk.has(ignored.toLowerCase())) {
                merged.push({
                    relativePath: ignored,
                    isIgnored: true,
                    isMissing: true
                });
            }
        }
        return merged.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
    }, [query.data, ignoredPaths]);
    const handleToggle = (0, react_1.useCallback)((relativePath, checked) => {
        const without = ignoredPaths.filter(p => p.toLowerCase() !== relativePath.toLowerCase());
        const updated = checked ? [...without, relativePath] : without;
        onChange(updated.length > 0 ? updated : null);
    }, [ignoredPaths, onChange]);
    if (!folderPath) {
        return (0, jsx_runtime_1.jsx)(material_1.Typography, { color: "text.secondary", children: "Set a sync location for this device to choose files to ignore." });
    }
    if (query.isFetched && rows.length === 0) {
        return (0, jsx_runtime_1.jsx)(material_1.Typography, { color: "text.secondary", children: "No files found in the sync location." });
    }
    return (0, jsx_runtime_1.jsx)(VerticalStack_1.default, { children: rows.map((row) => ((0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { control: (0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: row.isIgnored, onChange: (e) => handleToggle(row.relativePath, e.target.checked), disabled: disabled || query.isFetching }), label: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [row.relativePath, row.isMissing &&
                        (0, jsx_runtime_1.jsx)(material_1.Chip, { label: "missing", size: "small", color: "warning", sx: { ml: 1 } })] }) }, row.relativePath))) });
}
//# sourceMappingURL=IgnoredFilesPicker.js.map