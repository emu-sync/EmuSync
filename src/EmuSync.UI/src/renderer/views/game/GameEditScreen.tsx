import { cacheKeys } from "@/renderer/api/cache-keys";
import { getGameById, updateGame } from "@/renderer/api/game-api";
import BackToListButton from "@/renderer/components/buttons/BackToListButton";
import Container from "@/renderer/components/Container";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import useEditQuery from "@/renderer/hooks/use-edit-query";
import useIdParam from "@/renderer/hooks/use-id-query-param";
import { routes } from "@/renderer/routes";
import GameForm from "@/renderer/views/game/forms/GameForm";
import SyncStatusForm from "@/renderer/views/game/forms/SyncStatusForm";
import { Divider } from "@mui/material";
import { useMemo } from "react";


export default function GameEditScreen() {

    const id = useIdParam();

    const gameCacheKey = useMemo(() => {
        return cacheKeys.game(id);
    }, [id]);

    const gameSyncStatusKey = useMemo(() => {
        return cacheKeys.gameSyncStatus(id);
    }, [id]);

    const {
        query, updateMutation
    } = useEditQuery({
        queryFn: () => getGameById(id),
        queryKey: [gameCacheKey],
        relatedQueryKeys: [gameCacheKey, cacheKeys.gameList, gameSyncStatusKey],
        mutationFn: updateGame,
        successMessage: (game) => `Successfully updated game: ${game!.name}`,
        errorMessage: (game) => `Failed to update game: ${game.name}`,
    });

    return <VerticalStack>
        <Container>

            <BackToListButton
                href={routes.game.href}
            />

            <VerticalStack>

                <GameForm
                    isEdit
                    query={query}
                    saveMutation={updateMutation}
                />

                <Divider />

                <SyncStatusForm
                    gameId={id}
                    gameName={query.data?.name ?? ""}
                />
            </VerticalStack>

        </Container>

    </VerticalStack>
}