import ButtonRow from "@/renderer/components/buttons/ButtonRow";
import PickDirectoryButton from "@/renderer/components/buttons/PickDirectoryButton";
import LoadingHarness from "@/renderer/components/harnesses/LoadingHarness";
import SectionTitle from "@/renderer/components/SectionTitle";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import useEditForm from "@/renderer/hooks/use-edit-form";
import { routes } from "@/renderer/routes";
import { allSyncSourcesAtom } from "@/renderer/state/all-sync-sources";
import { localSyncSourceAtom } from "@/renderer/state/local-sync-source";
import { BaseFormProps as BaseEditFormProps, CreateGame, Game, GameSuggestion, GameSummary, UpdateGame } from "@/renderer/types";
import { defaultCreateGame, defaultUpdateGame, replacePathDelims, transformCreateGame, transformUpdateGame } from "@/renderer/views/game/utils/game-utils";
import { Button, Divider, Paper, Typography } from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import WarningAlert from "@/renderer/components/alerts/WarningAlert";
import DefaultCheckbox from "@/renderer/components/inputs/DefaultCheckbox";
import DefaultTextField from "@/renderer/components/inputs/DefaultTextField";
import GameSuggestionAutocomplete from "@/renderer/components/inputs/GameSuggestionAutocomplete";
import CheckboxSkeleton from "@/renderer/components/skeleton/CheckboxSkeleton";
import SaveButtonSkeleton from "@/renderer/components/skeleton/SaveButtonSkeleton";
import TextFieldSkeleton from "@/renderer/components/skeleton/TextFieldSkeleton";
import { OsPlatform } from "@/renderer/types/enums";
import Section from "@/renderer/components/Section";

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
        handleSubmit, control, formState, reset, setValue
    } = useEditForm({
        query,
        defaultValues: isEdit ? defaultUpdateGame : defaultCreateGame,
        transformData: isEdit ? transformUpdateGame : transformCreateGame
    });

    const autoSyncEnabled = useWatch({ control, name: "autoSync" });

    const handleFormSubmit = useCallback((data: UpdateGame | CreateGame) => {

        const cleanData = replacePathDelims(allSyncSources, data);

        if (isEdit) {

            const updateData = cleanData as UpdateGame;

            saveMutation.mutate(
                updateData,
                {
                    onSuccess: () => {
                        reset(data);
                    },
                }
            );

        } else {

            const createData = cleanData as CreateGame;

            saveMutation.mutate(
                createData,
                {
                    onSuccess: (newData) => {
                        navigate(`${routes.gameEdit.href}?id=${newData.id}`);
                    },
                }
            );
        }

    }, [saveMutation, isEdit, allSyncSources]);

    const handleGameSuggestionSelect = useCallback((game: GameSuggestion, filePath: string) => {

        //update the name on new games, but if someone is editing, let them keep the name they've set
        if (!isEdit) {
            setValue("name", game.name, { shouldDirty: true });
        }

        setValue(`syncSourceIdLocations.${localSyncSource.id}`, filePath, { shouldDirty: true });

    }, [setValue, isEdit, localSyncSource]);

    return <Section>

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

                    <GameSuggestionAutocomplete
                        onSelect={handleGameSuggestionSelect}
                    />

                    <Divider />

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
                                <Typography>
                                    Auto sync can destructively overwrite game files - use with caution.
                                </Typography>
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

                                const isWindows = src.platformId === OsPlatform.Windows;
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
                                                    defaultPath={field.value}
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
    </Section>
}


function LoadingState() {

    const [allSyncSources] = useAtom(allSyncSourcesAtom);

    return <VerticalStack>
        <TextFieldSkeleton />
        <Divider />
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