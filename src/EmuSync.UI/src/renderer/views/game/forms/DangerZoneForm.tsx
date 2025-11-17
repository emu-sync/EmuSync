import { cacheKeys } from "@/renderer/api/cache-keys";
import { deleteGame } from "@/renderer/api/game-api";
import ErrorAlert from "@/renderer/components/alerts/ErrorAlert";
import InfoAlert from "@/renderer/components/alerts/InfoAlert";
import DangerZone from "@/renderer/components/DangerZone";
import DeleteModal, { DeleteItemDetails } from "@/renderer/components/modals/DeleteModal";
import useAlerts from "@/renderer/hooks/use-alerts";
import { routes } from "@/renderer/routes";
import { Game } from "@/renderer/types";
import { Button, Divider } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";


interface DangerZoneFormProps {
    game: Game;
};

export default function DangerZoneForm({
    game
}: DangerZoneFormProps) {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { successAlert, errorAlert } = useAlerts();

    const deleteMutation = useMutation({
        mutationFn: deleteGame,
        onSuccess: async (data) => {

            queryClient.invalidateQueries({ queryKey: [cacheKeys.gameList] });

            successAlert(`Successfully deleted game: ${game.name}`);
            navigate(`${routes.game.href}`);
        },
        onError: () => {
            errorAlert(`Failed to delete game: ${game.name}`);
        },
    });

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [currentDeleteModel, setCurrentDeleteModel] = useState<DeleteItemDetails | null>(null);
    
    const handleDelete = useCallback((id: string) => {
        return deleteMutation.mutateAsync(id);
    }, [deleteMutation]);


    const handleDeleteClick = useCallback(() => {

        const details: DeleteItemDetails = {
            id: game.id,
            nameIdentifier: game.name,
            additionalDetailsComponent: <>
                <InfoAlert
                    content="Please note: This doesn't delete any local save files for the game."
                />
                <Divider />
            </>
        }

        setCurrentDeleteModel(details);
        setDeleteModalIsOpen(true);

    }, [game]);

    return <>
        <DangerZone>
            <ErrorAlert
                content="Permanently delete this game."
                action={
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </Button>
                }
            />
        </DangerZone>

        <DeleteModal
            isOpen={deleteModalIsOpen}
            setIsOpen={setDeleteModalIsOpen}
            deleteFunction={handleDelete}
            deleteDetails={currentDeleteModel}
            slotComponent={currentDeleteModel?.additionalDetailsComponent}
            maxWidth="sm"
        />
    </>
}