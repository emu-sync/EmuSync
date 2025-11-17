"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useSyncSourceMapper;
const all_sync_sources_1 = require("@/renderer/state/all-sync-sources");
const local_sync_source_1 = require("@/renderer/state/local-sync-source");
const jotai_1 = require("jotai");
const react_1 = require("react");
//custom hook to make alerts easier
function useSyncSourceMapper() {
    const [localSyncSource] = (0, jotai_1.useAtom)(local_sync_source_1.localSyncSourceAtom);
    const [allSyncsources] = (0, jotai_1.useAtom)(all_sync_sources_1.allSyncSourcesAtom);
    const mapSyncSource = (0, react_1.useCallback)((id) => {
        const result = allSyncsources.find(source => source.id === id);
        if (!result)
            return undefined;
        const name = result.id === localSyncSource.id ? `${result.name} (this device)` : result.name;
        return {
            id: result.id,
            name
        };
    }, [allSyncsources, localSyncSource]);
    return {
        mapSyncSource
    };
}
//# sourceMappingURL=use-sync-source-mapper.js.map