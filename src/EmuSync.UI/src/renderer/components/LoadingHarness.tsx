import ErrorAlert from "@/renderer/components/alerts/ErrorAlert";
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton } from "@mui/material";
import { UseQueryResult } from "@tanstack/react-query";
import React from "react";

interface LoadingHarnessProps {
    query: UseQueryResult;
    showLoadingOnRefetch?: boolean;
    loadingState: React.ReactNode;
    errorState?: React.ReactNode;
    children: React.ReactNode;
}

export default function LoadingHarness({
    query, loadingState, showLoadingOnRefetch, errorState,
    children
}: LoadingHarnessProps) {

    const isFirstTimeLoad = query.isLoading;
    const isRefetch = query.isFetching && !!(showLoadingOnRefetch);

    if (isFirstTimeLoad || isRefetch) {
        return loadingState;
    }

    if (query.isError) {
        return errorState ??
            <ErrorAlert
                content="An error occured loading the details"
                action={
                    <IconButton
                        onClick={() => query.refetch()}
                        title="Retry"
                        size="small"
                    >
                        <RefreshIcon
                            color="error"
                        />
                    </IconButton>
                }
            />

    }

    return children;
}
