import { cacheKeys } from "@/renderer/api/cache-keys";
import { createGame } from "@/renderer/api/game-api";
import BackToListButton from "@/renderer/components/buttons/BackToListButton";
import Container from "@/renderer/components/Container";
import useEditQuery from "@/renderer/hooks/use-edit-query";
import { routes } from "@/renderer/routes";
import { Game } from "@/renderer/types";
import GameForm from "@/renderer/views/game/forms/GameForm";

export default function GameAddScreen() {

    const {
        query, updateMutation
    } = useEditQuery({
        queryFn: () => {
            return null! as Game;
        },
        queryKey: [],
        relatedQueryKeys: [cacheKeys.gameList],
        mutationFn: createGame,
        successMessage: (game) => `Successfully created game: ${game.name}`,
        errorMessage: () => "Failed to create game"
    });

    return <Container>

        <BackToListButton
            href={routes.game.href}
        />
        <GameForm
            isEdit={false}
            query={query}
            saveMutation={updateMutation}
        />
    </Container>
}