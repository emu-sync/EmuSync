"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useEditQuery;
const use_alerts_1 = __importDefault(require("@/renderer/hooks/use-alerts"));
const react_query_1 = require("@tanstack/react-query");
function useEditQuery({ queryKey, relatedQueryKeys, queryFn, mutationFn, successCallback, errorCallback, successMessage, errorMessage }) {
    const { successAlert, errorAlert } = (0, use_alerts_1.default)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const query = (0, react_query_1.useQuery)({
        queryKey,
        queryFn
    });
    const updateMutation = (0, react_query_1.useMutation)({
        mutationFn,
        onSuccess: async (data) => {
            relatedQueryKeys.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
            let message = "Successfully saved changes";
            const messageData = data ?? query.data;
            if (successMessage) {
                message = successMessage(messageData);
            }
            successAlert(message ?? "Successfully saved changes");
            if (successCallback) {
                await successCallback(data);
            }
        },
        onError: async () => {
            let message = "Successfully saved changes";
            if (errorMessage && query.data) {
                message = errorMessage(query.data);
            }
            errorAlert(message ?? "Failed to save changes");
            if (errorCallback) {
                await errorCallback();
            }
        },
    });
    return {
        query,
        updateMutation
    };
}
//# sourceMappingURL=use-edit-query.js.map