import useAlerts from "@/renderer/hooks/use-alerts";
import { MutationFunction, QueryFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface useEditQueryParams<TResult, TUpdateData, TVariables> {
    queryKey: string[];
    relatedQueryKeys: string[];
    queryFn: QueryFunction<TResult>;
    mutationFn: MutationFunction<TUpdateData, TVariables>;
    successCallback?: (data: TUpdateData) => Promise<void>;
    errorCallback?: () => Promise<void>;
    successMessage?: (data: TUpdateData | TResult) => string;
    errorMessage?: (data: TResult) => string;
    disableAlerts?: boolean;
}

export default function useEditQuery<TResult, TUpdateData, TVariables>({
    queryKey, relatedQueryKeys, queryFn, mutationFn,
    successCallback, errorCallback,
    successMessage, errorMessage,
    disableAlerts
}: useEditQueryParams<TResult, TUpdateData, TVariables>) {

    const alertsEnabed = disableAlerts === undefined || disableAlerts === false;
     
    const { successAlert, errorAlert } = useAlerts();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey,
        queryFn
    });

    const updateMutation = useMutation({
        mutationFn,
        onSuccess: async (data) => {

            relatedQueryKeys.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });

            let message = "Successfully saved changes"
            const messageData = data ?? query.data;

            if (successMessage) {
                message = successMessage(messageData as never);
            }

            if (alertsEnabed) successAlert(message ?? "Successfully saved changes");

            if (successCallback) {
                await successCallback(data);
            }
        },
        onError: async () => {

            let message = "Failed to save changes"

            if (errorMessage && query.data) {
                message = errorMessage(query.data);
            }

            if (alertsEnabed) errorAlert(message ?? "Failed to save changes");

            if (errorCallback) {
                await errorCallback();
            }
        },
    });


    return {
        query,
        updateMutation
    }
}