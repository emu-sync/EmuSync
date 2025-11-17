import { cacheKeys } from "@/renderer/api/cache-keys";
import { getLocalSyncSource, updateLocalSyncSource } from "@/renderer/api/sync-source-api";
import DefaultTextField from "@/renderer/components/inputs/DefaultTextField";
import LoadingHarness from "@/renderer/components/LoadingHarness";
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
import { useCallback } from "react";
import { Controller } from "react-hook-form";

const Icon = routes.thisDevice.icon;

export default function SyncSourceForm() {

    const {
        query, updateMutation
    } = useEditQuery({
        queryFn: getLocalSyncSource,
        queryKey: [cacheKeys.localSyncSource],
        relatedQueryKeys: [cacheKeys.localSyncSource, cacheKeys.allSyncSources],
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
        <SaveButtonSkeleton />
        <TextFieldSkeleton />
    </>
}