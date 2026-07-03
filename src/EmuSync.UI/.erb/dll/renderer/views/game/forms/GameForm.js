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
const DefaultCheckbox_1 = __importDefault(require("@/renderer/components/inputs/DefaultCheckbox"));
const DefaultTextField_1 = __importDefault(require("@/renderer/components/inputs/DefaultTextField"));
const GameSuggestionAutocomplete_1 = __importDefault(require("@/renderer/components/inputs/GameSuggestionAutocomplete"));
const IgnoredFilesPicker_1 = __importDefault(require("@/renderer/components/inputs/IgnoredFilesPicker"));
const Section_1 = __importDefault(require("@/renderer/components/Section"));
const CheckboxSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/CheckboxSkeleton"));
const SaveButtonSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/SaveButtonSkeleton"));
const TextFieldSkeleton_1 = __importDefault(require("@/renderer/components/skeleton/TextFieldSkeleton"));
const Icon = routes_1.routes.game.icon;
function GameForm({ isEdit, query, gameId, saveMutation }) {
    const [overrideMaximumBackups, setOverrideMaximumBackups] = (0, react_1.useState)(false);
    const [maximumBackupsSaveValue, setMaximumBackupsSaveValue] = (0, react_1.useState)(null);
    //on first load, detect if an override is set
    (0, react_1.useEffect)(() => {
        if (query.isFetched && query.data) {
            setOverrideMaximumBackups((query.data?.maximumLocalGameBackups ?? null) !== null);
            setMaximumBackupsSaveValue(query.data?.maximumLocalGameBackups ?? null);
        }
    }, [query.isFetched, query.isRefetching]);
    const disabled = query.isFetching;
    const isSubmitting = saveMutation.isPending;
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [localSyncSource] = (0, jotai_1.useAtom)(local_sync_source_1.localSyncSourceAtom);
    const [allSyncSources] = (0, jotai_1.useAtom)(all_sync_sources_1.allSyncSourcesAtom);
    const { handleSubmit, control, formState, reset, setValue, getValues, watch } = (0, use_edit_form_1.default)({
        query,
        defaultValues: isEdit ? game_utils_1.defaultUpdateGame : game_utils_1.defaultCreateGame,
        transformData: isEdit ? game_utils_1.transformUpdateGame : game_utils_1.transformCreateGame
    });
    const autoSyncEnabled = watch("autoSync");
    const localFolderPath = watch(`syncSourceIdLocations.${localSyncSource.id}`);
    const handleOverrideMaximumBackupCheckboxChange = (0, react_1.useCallback)((checked) => {
        setOverrideMaximumBackups(checked);
        if (checked) {
            setValue("maximumLocalGameBackups", maximumBackupsSaveValue, { shouldDirty: true });
        }
        else {
            const oldValue = getValues("maximumLocalGameBackups");
            setMaximumBackupsSaveValue(oldValue);
            setValue("maximumLocalGameBackups", null, { shouldDirty: true });
        }
    }, [maximumBackupsSaveValue, getValues]);
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
    return (0, jsx_runtime_1.jsxs)(Section_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "Game details", icon: (0, jsx_runtime_1.jsx)(Icon, {}), sectionIsDirty: formState.isDirty, endAdornment: gameId ?
                    (0, jsx_runtime_1.jsx)(material_1.Chip, { label: `Game ID: ${gameId}`, size: "small" })
                    :
                        undefined }), (0, jsx_runtime_1.jsx)(LoadingHarness_1.default, { query: query, loadingState: (0, jsx_runtime_1.jsx)(LoadingState, {}), children: (0, jsx_runtime_1.jsx)("form", { onSubmit: handleSubmit(handleFormSubmit), children: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(GameSuggestionAutocomplete_1.default, { onSelect: handleGameSuggestionSelect }), (0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "name", control: control, rules: {
                                    required: "Name is required",
                                    maxLength: { value: 255, message: "Name must be less than 255 characters" }
                                }, render: ({ field, fieldState }) => ((0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { required: true, field: field, fieldState: fieldState, label: "Name", disabled: disabled || isSubmitting, placeholder: "Enter a name for the game" })) }), (0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { control: (0, jsx_runtime_1.jsx)(material_1.Checkbox, { checked: overrideMaximumBackups, onChange: (e) => handleOverrideMaximumBackupCheckboxChange(e.target.checked), disabled: disabled || isSubmitting }), label: "Override maximum local game backups?" }), overrideMaximumBackups &&
                                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "maximumLocalGameBackups", control: control, rules: {
                                                required: "This field is required",
                                                min: { value: 0, message: "Must be greater than -1" },
                                                validate: (v) => Number.isInteger(Number(v)) || "Must be a whole number"
                                            }, render: ({ field, fieldState }) => ((0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { required: true, field: field, fieldState: fieldState, label: "Maximum local game backups", type: "number", disabled: disabled || isSubmitting, placeholder: "Override the maximum amount of local backups kept for this game" })) }), (0, jsx_runtime_1.jsx)(material_1.Divider, {})] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "autoSync", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(DefaultCheckbox_1.default, { field: field, checked: field.value || false, onChange: (e) => field.onChange(e.target.checked), disabled: disabled || isSubmitting, label: "Automatically sync this game?" })) }), (0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, sx: {
                                    p: 2
                                }, component: VerticalStack_1.default, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Sync locations" }), allSyncSources.map((src) => {
                                        const isThisDevice = src.id === localSyncSource.id;
                                        let label = src.name;
                                        if (isThisDevice) {
                                            label += " (this device)";
                                        }
                                        return (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: `syncSourceIdLocations.${src.id}`, control: control, render: ({ field }) => {
                                                return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { field: field, placeholder: isThisDevice ? "Pick or enter a location" : "Enter a location", label: label, disabled: disabled || isSubmitting }), isThisDevice &&
                                                            (0, jsx_runtime_1.jsx)(PickDirectoryButton_1.default, { disabled: isSubmitting, defaultPath: field.value, onPickDirectory: (directory) => field.onChange(directory) })] });
                                            } }, src.id);
                                    })] }), isEdit && gameId &&
                                (0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, sx: {
                                        p: 2
                                    }, component: VerticalStack_1.default, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Ignored files" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", children: "Ticked files are excluded from syncing - useful for machine-specific files stored next to the game saves." }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "ignoredFilePaths", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(IgnoredFilesPicker_1.default, { gameId: gameId, syncSourceId: localSyncSource.id, folderPath: localFolderPath, value: field.value, onChange: (paths) => field.onChange(paths), disabled: disabled || isSubmitting })) })] }), (0, jsx_runtime_1.jsx)(ButtonRow_1.default, { children: (0, jsx_runtime_1.jsx)(material_1.Button, { color: "primary", variant: "contained", disabled: disabled || isSubmitting || !formState.isDirty, loading: isSubmitting, type: "submit", children: "Save changes" }) })] }) }) })] });
}
function LoadingState() {
    const [allSyncSources] = (0, jotai_1.useAtom)(all_sync_sources_1.allSyncSourcesAtom);
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(TextFieldSkeleton_1.default, {}), (0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(TextFieldSkeleton_1.default, {}), (0, jsx_runtime_1.jsx)(CheckboxSkeleton_1.default, { width: 274 }), (0, jsx_runtime_1.jsx)(CheckboxSkeleton_1.default, { width: 204 }), (0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, sx: {
                    p: 2
                }, component: VerticalStack_1.default, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Sync locations" }), allSyncSources.map((src) => {
                        return (0, jsx_runtime_1.jsx)(TextFieldSkeleton_1.default, {}, src.id);
                    })] }), (0, jsx_runtime_1.jsx)(SaveButtonSkeleton_1.default, {})] });
}
//# sourceMappingURL=GameForm.js.map