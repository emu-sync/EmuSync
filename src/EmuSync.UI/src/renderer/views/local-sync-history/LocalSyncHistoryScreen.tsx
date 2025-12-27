import { cacheKeys } from "@/renderer/api/cache-keys";
import { getGameList } from "@/renderer/api/game-api";
import { getAllLocalSyncLogs } from "@/renderer/api/local-sync-log-api";
import AgentStatusHarness from "@/renderer/components/harnesses/AgentStatusHarness";


import LocalSyncLogDataGrid from "@/renderer/components/datagrid/LocalSyncLogDataGrid";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";


export default function LocalSyncHistoryScreen() {

    const query = useQuery({
        queryKey: [cacheKeys.gameLocalSyncLogsList],
        queryFn: getAllLocalSyncLogs
    });

    const gamesQuery = useQuery({
        queryKey: [cacheKeys.gameList],
        queryFn: getGameList
    });

    //only show logs where the game exists
    const logsWithValidGames = useMemo(() => {

        if (query.data && gamesQuery.data) {

            const gameSet = new Set(gamesQuery.data.map(x=> x.id));
            return query.data.filter(x => gameSet.has(x.gameId))
        }

        return [];

    }, [query.data, gamesQuery.data]);

    return <AgentStatusHarness>
        <LocalSyncLogDataGrid
            loading={query.isLoading || gamesQuery.isLoading}
            hasError={query.isError}
            reloadFunc={query.refetch}
            games={gamesQuery.data ?? []}
            logs={logsWithValidGames}
            showToolbar
            showGameColumn
            disableSelection={false}
        />
    </AgentStatusHarness>
}
