import ButtonRow from "@/renderer/components/buttons/ButtonRow";
import PickDirectoryButton from "@/renderer/components/buttons/PickDirectoryButton";
import LoadingHarness from "@/renderer/components/LoadingHarness";
import SectionTitle from "@/renderer/components/SectionTitle";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import useEditForm from "@/renderer/hooks/use-edit-form";
import { routes } from "@/renderer/routes";
import { allSyncSourcesAtom } from "@/renderer/state/all-sync-sources";
import { localSyncSourceAtom } from "@/renderer/state/local-sync-source";
import { BaseFormProps as BaseEditFormProps, CreateGame, Game, GameSummary, UpdateGame } from "@/renderer/types";
import { defaultCreateGame, defaultUpdateGame, transformCreateGame, transformUpdateGame } from "@/renderer/views/game/utils/game-utils";
import { Button, Paper, Typography } from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import WarningAlert from "@/renderer/components/alerts/WarningAlert";
import DefaultCheckbox from "@/renderer/components/inputs/DefaultCheckbox";
import DefaultTextField from "@/renderer/components/inputs/DefaultTextField";
import CheckboxSkeleton from "@/renderer/components/skeleton/CheckboxSkeleton";
import SaveButtonSkeleton from "@/renderer/components/skeleton/SaveButtonSkeleton";
import TextFieldSkeleton from "@/renderer/components/skeleton/TextFieldSkeleton";

type GameFormCreateProps = BaseEditFormProps<CreateGame, GameSummary> & {
    isEdit: false;
};

type GameFormEditProps = BaseEditFormProps<UpdateGame, void> & {
    isEdit: true;
};

type GameFormProps = (GameFormCreateProps | GameFormEditProps) & {
    query: UseQueryResult<Game>;
};

const Icon = routes.game.icon;

export default function GameForm({
    isEdit, query,
    saveMutation
}: GameFormProps) {

    const disabled = query.isFetching;
    const isSubmitting = saveMutation.isPending;

    const navigate = useNavigate();
    const [localSyncSource] = useAtom(localSyncSourceAtom);
    const [allSyncSources] = useAtom(allSyncSourcesAtom);

    const {
        handleSubmit, control, formState, reset
    } = useEditForm({
        query,
        defaultValues: isEdit ? defaultUpdateGame : defaultCreateGame,
        transformData: isEdit ? transformUpdateGame : transformCreateGame
    });

    const autoSyncEnabled = useWatch({ control, name: "autoSync" });

    const handleFormSubmit = useCallback((data: UpdateGame | CreateGame) => {

        if (isEdit) {

            const updateData = data as UpdateGame;

            saveMutation.mutate(
                updateData,
                {
                    onSuccess: () => {
                        reset(data);
                    },
                }
            );

        } else {

            saveMutation.mutate(
                data,
                {
                    onSuccess: (newData) => {
                        navigate(`${routes.gameEdit.href}?id=${newData.id}`);
                    },
                }
            );
        }

    }, [saveMutation, isEdit]);

    return <VerticalStack>

        <SectionTitle
            title="Game details"
            icon={<Icon />}
            sectionIsDirty={formState.isDirty}
        />

        <LoadingHarness
            query={query}
            loadingState={
                <LoadingState />
            }
        >

            <form onSubmit={handleSubmit(handleFormSubmit)}>

                <VerticalStack>

                    <Controller
                        name="name"
                        control={control as never}
                        rules={{
                            required: "Name is required"
                        }}
                        render={({ field, fieldState }) => (
                            <DefaultTextField
                                field={field}
                                fieldState={fieldState}
                                label="Name"
                                disabled={disabled || isSubmitting}
                                placeholder="Enter a name for the game"
                            />
                        )}
                    />
                    <Controller
                        name="autoSync"
                        control={control as never}
                        render={({ field }) => (
                            <DefaultCheckbox
                                field={field}
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                                disabled={disabled || isSubmitting}
                                label="Automatically sync this game?"
                            />
                        )}
                    />

                    {
                        autoSyncEnabled &&
                        <WarningAlert
                            content={
                                <VerticalStack>
                                    <Typography>
                                        You should only enable AutoSync if you're <strong>absolutely</strong> sure.
                                    </Typography>
                                    <Typography>
                                        AutoSync can destructively overwrite game files if you open a game that isn't synced to this device yet.
                                    </Typography>
                                </VerticalStack>
                            }
                        />
                    }

                    <Paper
                        elevation={3}
                        sx={{
                            p: 2
                        }}
                        component={VerticalStack}
                    >
                        <Typography>Sync locations</Typography>
                        {
                            allSyncSources.map((src) => {

                                const isThisDevice = src.id === localSyncSource.id;
                                let label = src.name;

                                if (isThisDevice) {
                                    label += " (this device)";
                                }

                                return <Controller
                                    key={src.id}
                                    name={`syncSourceIdLocations.${src.id}` as const}
                                    control={control as never}

                                    render={({ field }) => {

                                        return <HorizontalStack>
                                            <DefaultTextField
                                                field={field}
                                                placeholder={isThisDevice ? "Pick or enter a location" : "Enter a location"}
                                                label={label}
                                                disabled={disabled || isSubmitting}
                                            />

                                            {
                                                isThisDevice &&
                                                <PickDirectoryButton
                                                    disabled={isSubmitting}
                                                    onPickDirectory={(directory) => field.onChange(directory)}
                                                />
                                            }
                                        </HorizontalStack>
                                    }}
                                />
                            })
                        }
                    </Paper>

                    <ButtonRow>
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={disabled || isSubmitting || !formState.isDirty}
                            loading={isSubmitting}
                            type="submit"
                        >
                            Save changes
                        </Button>
                    </ButtonRow>

                </VerticalStack>
            </form>
        </LoadingHarness>
    </VerticalStack>
}


function LoadingState() {

    const [allSyncSources] = useAtom(allSyncSourcesAtom);

    return <VerticalStack>
        <TextFieldSkeleton />
        <CheckboxSkeleton
            width={204}
        />
        <Paper
            elevation={3}
            sx={{
                p: 2
            }}
            component={VerticalStack}
        >
            <Typography>Sync locations</Typography>
            {
                allSyncSources.map((src) => {
                    return <TextFieldSkeleton key={src.id} />
                })
            }
        </Paper>
        <SaveButtonSkeleton />
    </VerticalStack>
}