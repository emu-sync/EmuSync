"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReleaseVersionChecker = useReleaseVersionChecker;
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const release_version_api_1 = require("@/renderer/api/release-version-api");
function useReleaseVersionChecker() {
    const [isNewVersion, setIsNewVersion] = (0, react_1.useState)(false);
    const releaseVersionQuery = (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.latestRelease],
        queryFn: release_version_api_1.getLatestReleaseVersion,
    });
    (0, react_1.useEffect)(() => {
        const latest = releaseVersionQuery.data || "";
        const current = window.electron.releaseVersion || "";
        if (!latest || !current) {
            setIsNewVersion(false);
            return;
        }
        setIsNewVersion(latest !== current);
    }, [releaseVersionQuery.data]);
    return {
        latestVersion: releaseVersionQuery.data ?? "Unknown",
        currentVersion: window.electron.releaseVersion ?? "Unknown",
        isNewVersion,
    };
}
//# sourceMappingURL=use-release-version-checker.js.map