import { allSyncSourcesAtom } from "@/renderer/state/all-sync-sources";
import { localSyncSourceAtom } from "@/renderer/state/local-sync-source";
import { useAtom } from "jotai";
import { useCallback } from "react";

interface SyncSourceMapResult {
    id: string;
    name: string;
}

//custom hook to make alerts easier
export default function useSyncSourceMapper() {

    const [localSyncSource] = useAtom(localSyncSourceAtom);
    const [allSyncsources] = useAtom(allSyncSourcesAtom);

    const mapSyncSource = useCallback((id: string): SyncSourceMapResult | undefined => {
        const result = allSyncsources.find(source => source.id === id);

        if (!result) return undefined;

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