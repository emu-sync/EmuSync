"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SharedFolderSetupForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const auth_api_1 = require("@/renderer/api/auth-api");
const ButtonRow_1 = __importDefault(require("@/renderer/components/buttons/ButtonRow"));
const PickDirectoryButton_1 = __importDefault(require("@/renderer/components/buttons/PickDirectoryButton"));
const DefaultTextField_1 = __importDefault(require("@/renderer/components/inputs/DefaultTextField"));
const ShowModal_1 = __importDefault(require("@/renderer/components/modals/ShowModal"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const use_alerts_1 = __importDefault(require("@/renderer/hooks/use-alerts"));
const local_sync_source_1 = require("@/renderer/state/local-sync-source");
const enums_1 = require("@/renderer/types/enums");
const path_utils_1 = require("@/renderer/utils/path-utils");
const material_1 = require("@mui/material");
const jotai_1 = require("jotai");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
function getDefaultValues() {
    return {
        path: "",
        password: "",
        username: ""
    };
}
function SharedFolderSetupForm({ isOpen, setIsOpen, onConnected }) {
    const [localSyncSource] = (0, jotai_1.useAtom)(local_sync_source_1.localSyncSourceAtom);
    const thisDeviceIsWindows = (0, react_1.useMemo)(() => {
        return localSyncSource.platformId === enums_1.OsPlatform.Windows;
    }, [localSyncSource]);
    const { successAlert, errorAlert } = (0, use_alerts_1.default)();
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const { handleSubmit, control, reset, formState, watch } = (0, react_hook_form_1.useForm)({
        defaultValues: getDefaultValues()
    });
    const userName = watch("username");
    const password = watch("password");
    const handleCancel = (0, react_1.useCallback)(() => {
        setIsOpen(false);
        reset(getDefaultValues());
    }, []);
    const handleFormSubmit = (0, react_1.useCallback)(async (data) => {
        setIsSubmitting(true);
        try {
            data.path = (0, path_utils_1.normalisePathDelims)(data.path, thisDeviceIsWindows);
            await (0, auth_api_1.completeSharedFolderSetup)(data);
            onConnected();
            successAlert("Successfully connected to shared/local folder");
        }
        catch (ex) {
            console.error(ex);
            errorAlert("An error occurred saving the shared folder details. If you're using a network folder, double check the details you've entered.");
        }
        finally {
            setIsSubmitting(false);
        }
    }, [onConnected, thisDeviceIsWindows]);
    return (0, jsx_runtime_1.jsx)(ShowModal_1.default, { isOpen: isOpen, setIsOpen: setIsOpen, title: "Set up a local/shared folder", children: (0, jsx_runtime_1.jsx)("form", { onSubmit: handleSubmit(handleFormSubmit), children: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "path", control: control, rules: { required: "Path is required" }, render: ({ field, fieldState }) => ((0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { required: true, field: field, fieldState: fieldState, label: "Path", disabled: isSubmitting, placeholder: thisDeviceIsWindows
                                        ? `E.g., \\\\Your-Device\\SharedFolder or C:\\YourFolder`
                                        : "E.g., /home/deck/your-folder" }), (0, jsx_runtime_1.jsx)(PickDirectoryButton_1.default, { disabled: isSubmitting, defaultPath: field.value, onPickDirectory: (directory) => field.onChange(directory) })] })) }), thisDeviceIsWindows && (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "username", control: control, rules: {
                                    required: !!password && "Required when a password has been set"
                                }, render: ({ field, fieldState }) => ((0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { required: !!userName || !!password, field: field, fieldState: fieldState, label: "Username", disabled: isSubmitting, placeholder: "Optional username if your folder requires credentials" })) }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "password", control: control, rules: {
                                    required: !!userName && "Required when a username has been set"
                                }, render: ({ field, fieldState }) => ((0, jsx_runtime_1.jsx)(DefaultTextField_1.default, { required: !!userName || !!password, field: field, fieldState: fieldState, label: "Password", disabled: isSubmitting, placeholder: "Optional password if your folder requires credentials", type: "password" })) })] }), (0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsxs)(ButtonRow_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { color: "primary", variant: "contained", disabled: isSubmitting || !formState.isDirty, loading: isSubmitting, type: "submit", children: "Save" }), (0, jsx_runtime_1.jsx)(material_1.Button, { color: "secondary", onClick: handleCancel, variant: "outlined", children: "Cancel" })] })] }) }) });
}
//# sourceMappingURL=SharedFolderSetupForm.js.map