import { cacheKeys } from "@/renderer/api/cache-keys";
import { getLocalSyncSource, getNextAutoSyncTime, updateLocalSyncSource } from "@/renderer/api/sync-source-api";
import InfoAlert from "@/renderer/components/alerts/InfoAlert";
import CountdownTimer from "@/renderer/components/dates/CountdownTimer";
import DefaultTextField from "@/renderer/components/inputs/DefaultTextField";
import LoadingHarness from "@/renderer/components/harnesses/LoadingHarness";
import SectionTitle from "@/renderer/components/SectionTitle";
import SaveButtonSkeleton from "@/renderer/components/skeleton/SaveButtonSkeleton";
import TextFieldSkeleton from "@/renderer/components/skeleton/TextFieldSkeleton";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import useEditForm from "@/renderer/hooks/use-edit-form";
import useEditQuery from "@/renderer/hooks/use-edit-query";
import { routes } from "@/renderer/routes";
import { defaultSyncSource } from "@/renderer/state/local-sync-source";
import { UpdateSyncSource } from "@/renderer/types";
import DisplayPlatform from "@/renderer/views/this-device/components/DisplayPlatform";
import { transformSyncSource } from "@/renderer/views/this-device/utils/sync-source-utils";
import { Box, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Controller, useWatch } from "react-hook-form";

const Icon = routes.thisDevice.icon;

export default function SyncSourceForm() {

    const nextAutoSyncTimeQuery = useQuery({
        queryKey: [cacheKeys.nextAutoSyncTime],
        queryFn: getNextAutoSyncTime
    });

    const {
        query, updateMutation
    } = useEditQuery({
        queryFn: getLocalSyncSource,
        queryKey: [cacheKeys.localSyncSource],
        relatedQueryKeys: [cacheKeys.localSyncSource, cacheKeys.allSyncSources, cacheKeys.nextAutoSyncTime],
        mutationFn: updateLocalSyncSource
    });

    const {
        handleSubmit, control, formState, reset
    } = useEditForm({
        query,
        defaultValues: defaultSyncSource,
        transformData: transformSyncSource
    });

    const handleFormSubmit = useCallback((data: UpdateSyncSource) => {

        if (!data.autoSyncFrequencyMins) {
            data.autoSyncFrequencyMins = null;
        }

        updateMutation.mutate(
            data,
            {
                onSuccess: () => {
                    reset(data);
                },
            }
        );
    }, [updateMutation]);

    const disabled = query.isFetching;
    const isSubmitting = updateMutation.isPending;

    const autoSyncFrequencyMins = useWatch({ control, name: "autoSyncFrequencyMins" });
    const autoSyncFrequencyMinsHasChanged = autoSyncFrequencyMins != query.data?.autoSyncFrequencyMins;

    return <form onSubmit={handleSubmit(handleFormSubmit)}>

        <VerticalStack>

            <SectionTitle
                title="Device details"
                icon={<Icon />}
                sectionIsDirty={formState.isDirty}
            />

            <LoadingHarness
                query={query}
                loadingState={
                    <LoadingState />
                }
            >
                <Controller
                    name="name"
                    control={control}
                    rules={{
                        required: "Name is required"
                    }}
                    render={({ field, fieldState }) => (
                        <DefaultTextField
                            field={field}
                            fieldState={fieldState}
                            label="Device name"
                            disabled={disabled || isSubmitting}
                        />
                    )}
                />

                <Controller
                    name="autoSyncFrequencyMins"
                    control={control}
                    rules={{
                        required: "AutoSync frequency is required",
                        min: { value: 1, message: "Must be greater than 0" },
                        validate: (v) => Number.isInteger(Number(v)) || "Must be a whole number"
                    }}
                    render={({ field, fieldState }) => (
                        <DefaultTextField
                            field={field}
                            fieldState={fieldState}
                            label="AutoSync frequency (in minutes)"
                            type="number"
                            disabled={disabled || isSubmitting}
                            placeholder="How often EmuSync will check if files need to uploaded/downloaded"
                        />
                    )}
                />

                {
                    autoSyncFrequencyMinsHasChanged &&
                    <InfoAlert
                        content="Changing the auto sync frequency will trigger AutoSync immediately"
                    />
                }


                {
                    nextAutoSyncTimeQuery.data &&

                    <Box sx={{ px: 1 }}>
                        <CountdownTimer
                            seconds={nextAutoSyncTimeQuery.data.secondsLeft}
                            reset={nextAutoSyncTimeQuery.refetch}
                        />
                    </Box>

                }


                <Box>
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={disabled || isSubmitting || !formState.isDirty}
                        loading={isSubmitting}
                        type="submit"
                    >
                        Save changes
                    </Button>
                </Box>


                {
                    (query.data?.platformId && query.data.platformId > 0) &&
                    <DisplayPlatform
                        osPlatform={query.data.platformId}
                    />
                }

            </LoadingHarness>

        </VerticalStack>
    </form >
}

function LoadingState() {
    return <>
        <TextFieldSkeleton />
        <TextFieldSkeleton />
        <SaveButtonSkeleton />
        <TextFieldSkeleton />
    </>
}