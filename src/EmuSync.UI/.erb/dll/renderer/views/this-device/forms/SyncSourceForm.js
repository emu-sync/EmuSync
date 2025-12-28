"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SyncSourceForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const sync_source_api_1 = require("@/renderer/api/sync-source-api");
const InfoAlert_1 = __importDefault(require("@/renderer/components/alerts/InfoAlert"));
const WarningAlert_1 = __importDefault(require("@/renderer/components/alerts/WarningAlert"));
const CountdownTimer_1 = __importDefault(require("@/renderer/components/dates/CountdownTimer"));
const LoadingHarness_1 = __importDefault(require("@/renderer/components/harnesses/LoadingHarness"));
const DefaultTextField_1 = __importDefault(require("@/renderer/components/inputs/DefaultTextField"));
const Section_1 = __importDefault(require("@/renderer/components/Section"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const SaveButtonSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/SaveButtonSkeleton"));
const TextFieldSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/TextFieldSkeleton"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const use_edit_form_1 = __importDefault(require("@/renderer/hooks/use-edit-form"));
const use_edit_query_1 = __importDefault(require("@/renderer/hooks/use-edit-query"));
const routes_1 = require("@/renderer/routes");
const local_sync_source_1 = require("@/renderer/state/local-sync-source");
const DisplayPlatform_1 = __importDefault(require("@/renderer/views/this-device/components/DisplayPlatform"));
const sync_source_utils_1 = require("@/renderer/views/this-device/utils/sync-source-utils");
const material_1 = require("@mui/material");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const Icon = routes_1.routes.thisDevice.icon;
function SyncSourceForm() {
    const nextAutoSyncTimeQuery = (0, react_query_1.useQuery)({
        queryKey: [cache_keys_1.cacheKeys.nextAutoSyncTime],
        queryFn: sync_source_api_1.getNextAutoSyncTime
    });
    const { query, updateMutation } = (0, use_edit_query_1.default)({
        queryFn: sync_source_api_1.getLocalSyncSource,
        queryKey: [cache_keys_1.cacheKeys.localSyncSource],
        relatedQueryKeys: [cache_keys_1.cacheKeys.localSyncSource, cache_keys_1.cacheKeys.allSyncSources, cache_keys_1.cacheKeys.nextAutoSyncTime],
        mutationFn: sync_source_api_1.updateLocalSyncSource
    });
    const { handleSubmit, control, formState, reset, watch } = (0, use_edit_form_1.default)({
        query,
        defaultValues: local_sync_source_1.defaultSyncSource,
        transformData: sync_source_utils_1.transformSyncSource
    });
    const handleFormSubmit = (0, react_1.useCallback)((data) => {
        if (!data.autoSyncFrequencyMins) {
            data.autoSyncFrequencyMins = null;
        }
        updateMutation.mutate(data, {
            onSuccess: () => {
                reset(data);
            },
        });
    }, [updateMutation]);
    const disabled = query.isFetching;
    const isSubmitting = updateMutation.isPending;
    const autoSyncFrequencyMins = watch("autoSyncFrequencyMins");
    const autoSyncFrequencyMinsHasChanged = autoSyncFrequencyMins != query.data?.autoSyncFrequencyMins;
    const maximumLocalGameBackups = watch("maximumLocalGameBackups");
    console.log(maximumLocalGameBackups);
    return (0, jsx_runtime_1.jsx)("form", { onSubmit: handleSubmit(handleFormSubmit), children: (0, jsx_runtime_1.jsxs)(Section_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "Device details", icon: (0, jsx_runtime_1.jsx)(Icon, {}), sectionIsDirty: formState.isDirty }), (0, jsx_runtime_1.jsxs)(LoadingHarness_1.default, { query: query, loadingState: (0, jsx_runtime_1.jsx)(LoadingState, {}), children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "name", control: control, rules: {
                                required: "Name is required"
                            }, render: ({ field, fieldState }) => ((0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { field: field, fieldState: fieldState, label: "Device name", disabled: disabled || isSubmitting })) }), (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { gap: 0.5, children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "maximumLocalGameBackups", control: control, rules: {
                                        required: "This field is required",
                                        min: { value: 0, message: "Must be greater than -1" },
                                        validate: (v) => Number.isInteger(Number(v)) || "Must be a whole number"
                                    }, render: ({ field, fieldState }) => ((0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { field: field, fieldState: fieldState, label: "Maximum local game backups (per game)", type: "number", disabled: disabled || isSubmitting, placeholder: "The maximum amount of local backups kept per game" })) }), (maximumLocalGameBackups === 0 || maximumLocalGameBackups === "0") &&
                                    (0, jsx_runtime_1.jsx)(WarningAlert_1.default, { content: "Having this value set to 0 disables local backups." })] }), (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { gap: 0.5, children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "autoSyncFrequencyMins", control: control, rules: {
                                        required: "This field is required",
                                        min: { value: 1, message: "Must be greater than 0" },
                                        validate: (v) => Number.isInteger(Number(v)) || "Must be a whole number"
                                    }, render: ({ field, fieldState }) => ((0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { field: field, fieldState: fieldState, label: "AutoSync frequency (in minutes)", type: "number", disabled: disabled || isSubmitting, placeholder: "How often EmuSync will check if files need to uploaded/downloaded" })) }), autoSyncFrequencyMinsHasChanged &&
                                    (0, jsx_runtime_1.jsx)(InfoAlert_1.default, { content: "Changing the auto sync frequency will trigger AutoSync immediately" })] }), nextAutoSyncTimeQuery.data &&
                            (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { px: 1 }, children: (0, jsx_runtime_1.jsx)(CountdownTimer_1.default, { seconds: nextAutoSyncTimeQuery.data.secondsLeft, reset: nextAutoSyncTimeQuery.refetch }) }), (0, jsx_runtime_1.jsx)(material_1.Box, { children: (0, jsx_runtime_1.jsx)(material_1.Button, { color: "primary", variant: "contained", disabled: disabled || isSubmitting || !formState.isDirty, loading: isSubmitting, type: "submit", children: "Save changes" }) }), (query.data?.platformId && query.data.platformId > 0) &&
                            (0, jsx_runtime_1.jsx)(DisplayPlatform_1.default, { osPlatform: query.data.platformId })] })] }) });
}
function LoadingState() {
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(TextFieldSkeleton_1.default, {}), (0, jsx_runtime_1.jsx)(TextFieldSkeleton_1.default, {}), (0, jsx_runtime_1.jsx)(SaveButtonSkeleton_1.default, {}), (0, jsx_runtime_1.jsx)(TextFieldSkeleton_1.default, {})] });
}
//# sourceMappingURL=SyncSourceForm.js.map