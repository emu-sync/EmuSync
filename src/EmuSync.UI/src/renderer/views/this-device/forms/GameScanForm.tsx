import { cacheKeys } from "@/renderer/api/cache-keys";
import { forceGameScan, getGameScanDetails } from "@/renderer/api/sync-source-api";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { Button, CircularProgress, LinearProgress, Paper, Typography } from "@mui/material";

import LoadingHarness from "@/renderer/components/harnesses/LoadingHarness";
import SectionTitle from "@/renderer/components/SectionTitle";
import HorizontalStack from "@/renderer/components/stacks/HorizontalStack";
import useEditQuery from "@/renderer/hooks/use-edit-query";
import RadarIcon from '@mui/icons-material/Radar';
import { useCallback, useEffect } from "react";
import TimeAgo from "@/renderer/components/dates/TimeAgo";
import LinearProgressWithLabel from "@/renderer/views/this-device/components/LinearProgressWithLabel";
import ExternalLinkButton from "@/renderer/components/buttons/ExternalLinkButton";
import { Pre } from "@/renderer/components/Pre";

export default function GameScanForm() {

    const {
        query, updateMutation
    } = useEditQuery({
        queryFn: getGameScanDetails,
        queryKey: [cacheKeys.gameScanDetails],
        relatedQueryKeys: [cacheKeys.gameScanDetails],
        mutationFn: forceGameScan,
        disableAlerts: true
    });

    const handleMutation = useCallback(() => {
        updateMutation.mutate(undefined);
    }, [updateMutation]);

    const isInProgress = query.data?.inProgress ?? false;

    useEffect(() => {

        if (!isInProgress) return;

        const interval = setInterval(() => {
            query.refetch();
        }, 200);

        return () => clearInterval(interval);

    }, [isInProgress]);

    return <VerticalStack>

        <SectionTitle
            title="Game save detection"
            icon={<RadarIcon />}
        />

        <LoadingHarness
            query={query}
            loadingState={
                <LoadingState />
            }
        >
            <Typography>
                EmuSync uses the <ExternalLinkButton href="https://github.com/mtkennerly/ludusavi-manifest" text="Ludusavi Manifest" /> to detect game saves on your device. 
                If some of your games saves aren't detected, it might not be in the manifest yet.
                If it's in the manifest, but not being detected by EmuSync, and you're sure the data exists, pleae raise an issue in <ExternalLinkButton href="https://github.com/emu-sync/EmuSync/issues" text="issues" /> page.
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    height: 72
                }}
                component={HorizontalStack}
                justifyContent="space-between"
            >
                {
                    isInProgress ?
                        <>
                            <LinearProgressWithLabel value={query.data?.progressPercent ?? 0} />
                        </>

                        :

                        <>
                            <Typography>
                                The last game scan was <TimeAgo secondsAgo={query.data?.lastScanSeconds ?? 0} /> and found <Pre>{query.data?.countOfGames}</Pre> games.
                            </Typography>

                            <Button
                                color="primary"
                                variant="contained"
                                disabled={updateMutation.isPending}
                                loading={updateMutation.isPending}
                                onClick={handleMutation}
                                sx={{
                                    minWidth: 100
                                }}
                            >
                                Scan now
                            </Button>
                        </>

                }

            </Paper>

        </LoadingHarness>

    </VerticalStack>
}


function LoadingState() {
    return <HorizontalStack>
        <Typography>
            Loading game scan details...
        </Typography>
        <CircularProgress size={16} />
    </HorizontalStack>
}