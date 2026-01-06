import { cacheKeys } from "@/renderer/api/cache-keys";
import { getSyncProgress } from "@/renderer/api/game-sync-api";
import useEditQuery from "@/renderer/hooks/use-edit-query";
import { useEffect } from "react";

export default function useSyncProgressPoll(gameId: string) {

    const {
        query
    } = useEditQuery({
        queryFn: () => getSyncProgress(gameId),
        queryKey: [cacheKeys.gameSyncProgres],
        relatedQueryKeys: [cacheKeys.gameSyncProgres],
        mutationFn: async () => { },
        disableAlerts: true
    });

    const isInProgress = query.data?.inProgress ?? false;

    useEffect(() => {

        const interval = setInterval(() => {
            query.refetch();
        }, 200);

        return () => clearInterval(interval);

    }, []);

    return {
        isInProgress,
        currentStage: query.data?.currentStage ?? "",
        overallCompletionPercent: query.data?.overallCompletionPercent ?? 0
    }
}