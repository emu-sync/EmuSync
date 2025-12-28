"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoadingHarness;
const jsx_runtime_1 = require("react/jsx-runtime");
const ErrorAlert_1 = __importDefault(require("@/renderer/components/alerts/ErrorAlert"));
const Refresh_1 = __importDefault(require("@mui/icons-material/Refresh"));
const material_1 = require("@mui/material");
function LoadingHarness({ query, loadingState, showLoadingOnRefetch, errorState, children }) {
    const isFirstTimeLoad = query.isLoading;
    const isRefetch = query.isFetching && !!(showLoadingOnRefetch);
    if (isFirstTimeLoad || isRefetch) {
        return loadingState;
    }
    if (query.isError) {
        return errorState ??
            (0, jsx_runtime_1.jsx)(ErrorAlert_1.default, { content: "An error occured loading the details", action: (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => query.refetch(), title: "Retry", size: "small", children: (0, jsx_runtime_1.jsx)(Refresh_1.default, { color: "error" }) }) });
    }
    return children;
}
//# sourceMappingURL=LoadingHarness.js.map