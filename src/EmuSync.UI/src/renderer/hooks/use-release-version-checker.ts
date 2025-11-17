import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cacheKeys } from "@/renderer/api/cache-keys";
import { getLatestReleaseVersion } from "@/renderer/api/release-version-api";

export function useReleaseVersionChecker() {

    const [isNewVersion, setIsNewVersion] = useState(false);

    const releaseVersionQuery = useQuery({
        queryKey: [cacheKeys.latestRelease],
        queryFn: getLatestReleaseVersion,
    });

    useEffect(() => {
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
