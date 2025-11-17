import useAlerts from "@/renderer/hooks/use-alerts";
import { MutationFunction, QueryFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface useEditQueryParams<TResult, TUpdateData, TVariables> {
    queryKey: string[]; //the query key used to cache the query
    relatedQueryKeys: string[]; //the query key that gets cleared after a successful mutation
    queryFn: QueryFunction<TResult>;
    mutationFn: MutationFunction<TUpdateData, TVariables>;
    successCallback?: (data: TUpdateData) => Promise<void>;
    errorCallback?: () => Promise<void>;
    successMessage?: string;
    errorMessage?: string;
}

export default function useListQuery<TResult, TUpdateData, TVariables>({
    queryKey, relatedQueryKeys, queryFn, mutationFn,
    successCallback, errorCallback,
    successMessage, errorMessage
}: useEditQueryParams<TResult, TUpdateData, TVariables>) {

    const { successAlert, errorAlert } = useAlerts();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey,
        queryFn
    });

    const deleteMutation = useMutation({
        mutationFn,
        onSuccess: async (data) => {

            relatedQueryKeys.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });

            successAlert(successMessage ?? "Successfully deleted item");

            if (successCallback) {
                await successCallback(data);
            }
        },
        onError: async () => {

            errorAlert(errorMessage ?? "Failed to delete item");

            if (errorCallback) {
                await errorCallback();
            }
        },
    });


    return {
        query,
        deleteMutation
    }
}