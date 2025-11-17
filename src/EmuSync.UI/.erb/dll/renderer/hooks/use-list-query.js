"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useListQuery;
const use_alerts_1 = __importDefault(require("@/renderer/hooks/use-alerts"));
const react_query_1 = require("@tanstack/react-query");
function useListQuery({ queryKey, relatedQueryKeys, queryFn, mutationFn, successCallback, errorCallback, successMessage, errorMessage }) {
    const { successAlert, errorAlert } = (0, use_alerts_1.default)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const query = (0, react_query_1.useQuery)({
        queryKey,
        queryFn
    });
    const deleteMutation = (0, react_query_1.useMutation)({
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
    };
}
//# sourceMappingURL=use-list-query.js.map