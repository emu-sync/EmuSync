"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GlobalStateAndEvents;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const sync_source_api_1 = require("@/renderer/api/sync-source-api");
const system_info_api_1 = require("@/renderer/api/system-info-api");
const agent_status_1 = require("@/renderer/state/agent-status");
const all_sync_sources_1 = require("@/renderer/state/all-sync-sources");
const local_sync_source_1 = require("@/renderer/state/local-sync-source");
const react_query_1 = require("@tanstack/react-query");
const jotai_1 = require("jotai");
const react_1 = require("react");
function GlobalStateAndEvents() {
    const [localSyncSource, setLocalSyncSource] = (0, jotai_1.useAtom)(local_sync_source_1.localSyncSourceAtom);
    const [allSyncSources, setAllSyncSources] = (0, jotai_1.useAtom)(all_sync_sources_1.allSyncSourcesAtom);
    const [agentStatus, setAgentStatus] = (0, jotai_1.useAtom)(agent_status_1.agentStatusAtom);
    // LOCAL SYNC SOURCE DATA 
    const localSyncSourceQuery = (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.localSyncSource],
        queryFn: sync_source_api_1.getLocalSyncSource
    });
    (0, react_1.useEffect)(() => {
        if (localSyncSourceQuery.data) {
            setLocalSyncSource(localSyncSourceQuery.data);
        }
    }, [localSyncSourceQuery.data]);
    // END LOCAL SYNC SOURCE DATA 
    // ALL SYNC SOURCE DATA 
    const allSyncSourcesQuery = (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.allSyncSources],
        queryFn: sync_source_api_1.getSyncSourceList
    });
    (0, react_1.useEffect)(() => {
        if (allSyncSourcesQuery.data) {
            setAllSyncSources(allSyncSourcesQuery.data);
        }
    }, [allSyncSourcesQuery.data]);
    // END LOCAL SYNC SOURCE DATA 
    // AGENT STATUS
    const healthCheckQuery = (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.healthCheck],
        queryFn: system_info_api_1.checkApiIsRunning,
    });
    (0, react_1.useEffect)(() => {
        const isRunning = typeof healthCheckQuery.data !== "undefined";
        setAgentStatus({
            isRunning,
            hasChecked: true
        });
    }, [healthCheckQuery.data]);
    // END AGENT STATUS
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
}
//# sourceMappingURL=GlobalStateAndEvents.js.map