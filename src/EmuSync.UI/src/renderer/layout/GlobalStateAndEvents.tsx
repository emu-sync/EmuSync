"use client";

import { cacheKeys } from "@/renderer/api/cache-keys";
import { getLatestReleaseVersion } from "@/renderer/api/release-version-api";
import { getLocalSyncSource, getSyncSourceList } from "@/renderer/api/sync-source-api";
import { checkApiIsRunning } from "@/renderer/api/system-info-api";
import { agentStatusAtom } from "@/renderer/state/agent-status";
import { allSyncSourcesAtom } from "@/renderer/state/all-sync-sources";
import { localSyncSourceAtom } from "@/renderer/state/local-sync-source";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

import { useEffect } from "react";


export default function GlobalStateAndEvents() {

    const [localSyncSource, setLocalSyncSource] = useAtom(localSyncSourceAtom);
    const [allSyncSources, setAllSyncSources] = useAtom(allSyncSourcesAtom);
    const [agentStatus, setAgentStatus] = useAtom(agentStatusAtom);

    // LOCAL SYNC SOURCE DATA 

    const localSyncSourceQuery = useQuery({
        queryKey: [cacheKeys.localSyncSource],
        queryFn: getLocalSyncSource
    });

    useEffect(() => {

        if (localSyncSourceQuery.data) {
            setLocalSyncSource(localSyncSourceQuery.data);
        }

    }, [localSyncSourceQuery.data]);

    // END LOCAL SYNC SOURCE DATA 


    // ALL SYNC SOURCE DATA 

    const allSyncSourcesQuery = useQuery({
        queryKey: [cacheKeys.allSyncSources],
        queryFn: getSyncSourceList
    });

    useEffect(() => {

        if (allSyncSourcesQuery.data) {
            setAllSyncSources(allSyncSourcesQuery.data);
        }

    }, [allSyncSourcesQuery.data]);

    // END LOCAL SYNC SOURCE DATA 

    // AGENT STATUS

    const healthCheckQuery = useQuery({
        queryKey: [cacheKeys.healthCheck],
        queryFn: checkApiIsRunning,
    });

    useEffect(() => {

        const isRunning = typeof healthCheckQuery.data !== "undefined";

        setAgentStatus({
            isRunning,
            hasChecked: true
        });

    }, [healthCheckQuery.data]);

    // END AGENT STATUS

    return <></>;
}