import { cacheKeys } from "@/renderer/api/cache-keys";
import { getLocalSyncLogsForGame } from "@/renderer/api/local-sync-log-api";
import InfoAlert from "@/renderer/components/alerts/InfoAlert";
import LoadingHarness from "@/renderer/components/harnesses/LoadingHarness";
import LocalSyncLogDataGrid from "@/renderer/components/datagrid/LocalSyncLogDataGrid";
import SectionTitle from "@/renderer/components/SectionTitle";
import AlertSkeleton from "@/renderer/components/skeleton/AlertSkeleton";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { routes } from "@/renderer/routes";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const Icon = routes.localSyncHistory.icon;


interface LocalSyncLogFormProps {
    gameId: string;
};

export default function LocalSyncLogForm({
    gameId
}: LocalSyncLogFormProps) {

    const gameLocalSyncLogsKey = useMemo(() => {
        return cacheKeys.gameLocalSyncLogs(gameId);
    }, [gameId]);

    const query = useQuery({
        queryKey: [gameLocalSyncLogsKey],
        queryFn: () => getLocalSyncLogsForGame(gameId)
    });

    return <VerticalStack>
        <SectionTitle
            title="Local sync history"
            icon={<Icon />}
        />
        <LoadingHarness
            query={query}
            loadingState={
                <LoadingState />
            }
        >
            {
                query.data && query.data.length > 0 ?
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            maxHeight: 500,
                        }}
                    >
                        <LocalSyncLogDataGrid
                            logs={query.data}
                            games={[]}
                            showGameColumn={false}
                            showToolbar={false}
                            loading={false}
                            hasError={false}
                            disableSelection
                            reloadFunc={async () => { }}
                        />
                    </div>
                    :
                    <InfoAlert
                        content="No local sync logs are available for this game. This may be because the game has never been synced on this device, or because all previous logs have been removed due to log storage limits."
                    />
            }
        </LoadingHarness>
    </VerticalStack>
}


function LoadingState() {

    return <VerticalStack>
        <AlertSkeleton />
    </VerticalStack>
}