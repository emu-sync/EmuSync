"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GameForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const ButtonRow_1 = __importDefault(require("@/renderer/components/buttons/ButtonRow"));
const PickDirectoryButton_1 = __importDefault(require("@/renderer/components/buttons/PickDirectoryButton"));
const LoadingHarness_1 = __importDefault(require("@/renderer/components/harnesses/LoadingHarness"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const use_edit_form_1 = __importDefault(require("@/renderer/hooks/use-edit-form"));
const routes_1 = require("@/renderer/routes");
const all_sync_sources_1 = require("@/renderer/state/all-sync-sources");
const local_sync_source_1 = require("@/renderer/state/local-sync-source");
const game_utils_1 = require("@/renderer/views/game/utils/game-utils");
const material_1 = require("@mui/material");
const jotai_1 = require("jotai");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const react_router_dom_1 = require("react-router-dom");
const WarningAlert_1 = __importDefault(require("@/renderer/components/alerts/WarningAlert"));
const DefaultCheckbox_1 = __importDefault(require("@/renderer/components/inputs/DefaultCheckbox"));
const DefaultTextField_1 = __importDefault(require("@/renderer/components/inputs/DefaultTextField"));
const GameSuggestionAutocomplete_1 = __importDefault(require("@/renderer/components/inputs/GameSuggestionAutocomplete"));
const CheckboxSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/CheckboxSkeleton"));
const SaveButtonSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/SaveButtonSkeleton"));
const TextFieldSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/TextFieldSkeleton"));
const enums_1 = require("@/renderer/types/enums");
const Icon = routes_1.routes.game.icon;
function GameForm({ isEdit, query, saveMutation }) {
    const disabled = query.isFetching;
    const isSubmitting = saveMutation.isPending;
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [localSyncSource] = (0, jotai_1.useAtom)(local_sync_source_1.localSyncSourceAtom);
    const [allSyncSources] = (0, jotai_1.useAtom)(all_sync_sources_1.allSyncSourcesAtom);
    const { handleSubmit, control, formState, reset, setValue } = (0, use_edit_form_1.default)({
        query,
        defaultValues: isEdit ? game_utils_1.defaultUpdateGame : game_utils_1.defaultCreateGame,
        transformData: isEdit ? game_utils_1.transformUpdateGame : game_utils_1.transformCreateGame
    });
    const autoSyncEnabled = (0, react_hook_form_1.useWatch)({ control, name: "autoSync" });
    const handleFormSubmit = (0, react_1.useCallback)((data) => {
        const cleanData = (0, game_utils_1.replacePathDelims)(allSyncSources, data);
        if (isEdit) {
            const updateData = cleanData;
            saveMutation.mutate(updateData, {
                onSuccess: () => {
                    reset(data);
                },
            });
        }
        else {
            const createData = cleanData;
            saveMutation.mutate(createData, {
                onSuccess: (newData) => {
                    navigate(`${routes_1.routes.gameEdit.href}?id=${newData.id}`);
                },
            });
        }
    }, [saveMutation, isEdit, allSyncSources]);
    const handleGameSuggestionSelect = (0, react_1.useCallback)((game, filePath) => {
        //update the name on new games, but if someone is editing, let them keep the name they've set
        if (!isEdit) {
            setValue("name", game.name, { shouldDirty: true });
        }
        setValue(`syncSourceIdLocations.${localSyncSource.id}`, filePath, { shouldDirty: true });
    }, [setValue, isEdit, localSyncSource]);
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "Game details", icon: (0, jsx_runtime_1.jsx)(Icon, {}), sectionIsDirty: formState.isDirty }), (0, jsx_runtime_1.jsx)(LoadingHarness_1.default, { query: query, loadingState: (0, jsx_runtime_1.jsx)(LoadingState, {}), children: (0, jsx_runtime_1.jsx)("form", { onSubmit: handleSubmit(handleFormSubmit), children: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(GameSuggestionAutocomplete_1.default, { onSelect: handleGameSuggestionSelect }), (0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "name", control: control, rules: {
                                    required: "Name is required"
                                }, render: ({ field, fieldState }) => ((0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { field: field, fieldState: fieldState, label: "Name", disabled: disabled || isSubmitting, placeholder: "Enter a name for the game" })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "autoSync", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(DefaultCheckbox_1.default, { field: field, checked: field.value || false, onChange: (e) => field.onChange(e.target.checked), disabled: disabled || isSubmitting, label: "Automatically sync this game?" })) }), autoSyncEnabled &&
                                (0, jsx_runtime_1.jsx)(WarningAlert_1.default, { content: (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Auto sync can destructively overwrite game files - use with caution." }) }), (0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, sx: {
                                    p: 2
                                }, component: VerticalStack_1.default, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Sync locations" }), allSyncSources.map((src) => {
                                        const isWindows = src.platformId === enums_1.OsPlatform.Windows;
                                        const isThisDevice = src.id === localSyncSource.id;
                                        let label = src.name;
                                        if (isThisDevice) {
                                            label += " (this device)";
                                        }
                                        return (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `syncSourceIdLocations.${src.id}`, control: control, render: ({ field }) => {
                                                return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { field: field, placeholder: isThisDevice ? "Pick or enter a location" : "Enter a location", label: label, disabled: disabled || isSubmitting }), isThisDevice &&
                                                            (0, jsx_runtime_1.jsx)(PickDirectoryButton_1.default, { disabled: isSubmitting, defaultPath: field.value, onPickDirectory: (directory) => field.onChange(directory) })] });
                                            } }, src.id);
                                    })] }), (0, jsx_runtime_1.jsx)(ButtonRow_1.default, { children: (0, jsx_runtime_1.jsx)(material_1.Button, { color: "primary", variant: "contained", disabled: disabled || isSubmitting || !formState.isDirty, loading: isSubmitting, type: "submit", children: "Save changes" }) })] }) }) })] });
}
function LoadingState() {
    const [allSyncSources] = (0, jotai_1.useAtom)(all_sync_sources_1.allSyncSourcesAtom);
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(TextFieldSkeleton_1.default, {}), (0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(TextFieldSkeleton_1.default, {}), (0, jsx_runtime_1.jsx)(CheckboxSkeleton_1.default, { width: 204 }), (0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, sx: {
                    p: 2
                }, component: VerticalStack_1.default, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Sync locations" }), allSyncSources.map((src) => {
                        return (0, jsx_runtime_1.jsx)(TextFieldSkeleton_1.default, {}, src.id);
                    })] }), (0, jsx_runtime_1.jsx)(SaveButtonSkeleton_1.default, {})] });
}
//# sourceMappingURL=GameForm.js.map