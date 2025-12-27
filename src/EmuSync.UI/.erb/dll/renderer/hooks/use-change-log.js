"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChangeLog = useChangeLog;
const cache_keys_1 = require("@/renderer/api/cache-keys");
const react_query_1 = require("@tanstack/react-query");
const changeLogUrl = "https://raw.githubusercontent.com/emu-sync/EmuSync/refs/heads/main/CHANGELOG.md";
function parseChangeLog(text) {
    const lines = text.split("\n");
    const result = [];
    let currentVersion = "";
    let buffer = [];
    for (const line of lines) {
        const match = line.match(/^#\s*v([\d.]+)\s*$/);
        if (match) {
            if (currentVersion) {
                result.push({
                    version: currentVersion,
                    markdown: buffer.join("\n").trim(),
                });
            }
            currentVersion = `v${match[1]}`;
            buffer = [];
        }
        else {
            buffer.push(line);
        }
    }
    if (currentVersion) {
        result.push({
            version: currentVersion,
            markdown: buffer.join("\n").trim(),
        });
    }
    return result;
}
function useChangeLog() {
    return (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.changeLog],
        queryFn: async () => {
            const res = await fetch(changeLogUrl);
            const text = await res.text();
            return parseChangeLog(text);
        },
    });
}
//# sourceMappingURL=use-change-log.js.map