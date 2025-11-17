"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StorageProviderSelector;
const jsx_runtime_1 = require("react/jsx-runtime");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const enums_1 = require("@/renderer/types/enums");
const material_1 = require("@mui/material");
const react_1 = require("react");
const material_2 = require("@mui/material");
const InfoAlert_1 = __importDefault(require("@/renderer/components/alerts/InfoAlert"));
const ShowModal_1 = __importDefault(require("@/renderer/components/modals/ShowModal"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const auth_api_1 = require("@/renderer/api/auth-api");
const StorageProviderDetails_1 = __importDefault(require("@/renderer/views/this-device/components/StorageProviderDetails"));
const sync_source_utils_1 = require("@/renderer/views/this-device/utils/sync-source-utils");
const use_alerts_1 = __importDefault(require("@/renderer/hooks/use-alerts"));
function StorageProviderSelector({ onConnected }) {
    const { errorAlert } = (0, use_alerts_1.default)();
    const [modalIsOpen, setModalIsOpen] = (0, react_1.useState)(false);
    const [openWindow, setOpenWindow] = (0, react_1.useState)(null);
    const [dropboxIsLoading, setDropboxIsLoading] = (0, react_1.useState)(false);
    const [googleIsLoading, setGoogleIsLoading] = (0, react_1.useState)(false);
    const handleSelect = (0, react_1.useCallback)(async (url) => {
        if (openWindow) {
            openWindow.close();
        }
        const newOpenWindow = window.open(url);
        setOpenWindow(newOpenWindow);
        setModalIsOpen(true);
    }, [openWindow]);
    const handleSelectDropbox = (0, react_1.useCallback)(async () => {
        setDropboxIsLoading(true);
        try {
            const authUrlResponse = await (0, auth_api_1.getDropboxAuthUrl)();
            handleSelect(authUrlResponse.url);
        }
        catch (ex) {
            console.error(ex);
            errorAlert("Failed to get Dropbox auth URL");
            setModalIsOpen(false);
        }
        finally {
            setDropboxIsLoading(false);
        }
    }, [handleSelect]);
    const handleSelectGoogle = (0, react_1.useCallback)(async () => {
        setGoogleIsLoading(true);
        try {
            const authUrlResponse = await (0, auth_api_1.getGoogleAuthUrl)();
            handleSelect(authUrlResponse.url);
        }
        catch (ex) {
            console.error(ex);
            errorAlert("Failed to get Google auth URL");
            setModalIsOpen(false);
        }
        finally {
            setGoogleIsLoading(false);
        }
    }, [handleSelect]);
    (0, react_1.useEffect)(() => {
        if (!openWindow)
            return;
        const interval = setInterval(() => {
            if (openWindow.closed) {
                setModalIsOpen(false);
                onConnected();
                setOpenWindow(null);
                clearInterval(interval);
            }
        }, 500); // check every 500ms
        return () => clearInterval(interval);
    }, [openWindow]);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(InfoAlert_1.default, { content: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Please select a provider where your game data will be stored." }), (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Selecting a provider for the first time will open a browser window for you to log in and grant EmuSync permission to your storage." })] }) }), (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(ProviderSelector, { provider: enums_1.StorageProvider.GoogleDrive, onSelect: handleSelectGoogle, loading: googleIsLoading }), (0, jsx_runtime_1.jsx)(ProviderSelector, { provider: enums_1.StorageProvider.Dropbox, onSelect: handleSelectDropbox, loading: dropboxIsLoading })] })] }), (0, jsx_runtime_1.jsx)(ShowModal_1.default, { isOpen: modalIsOpen, setIsOpen: () => { }, title: "Connecting to provider", children: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(InfoAlert_1.default, { content: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "A window should open for you to log in to your provider. EmuSync only has access to the file and folders it creates." }), (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "If you've used this provider on this device before, it should automatically log in after a few seconds." })] }) }), (0, jsx_runtime_1.jsx)(material_1.Typography, { textAlign: "center", children: (0, jsx_runtime_1.jsx)(material_2.CircularProgress, { size: 20 }) })] }) })] });
}
function ProviderSelector({ provider, onSelect, loading }) {
    const providerDetails = (0, react_1.useMemo)(() => {
        return sync_source_utils_1.storageProviderMap[provider];
    }, [provider]);
    const handleSelect = (0, react_1.useCallback)(() => {
        onSelect(provider);
    }, [onSelect, provider]);
    return (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleSelect, color: "secondary", variant: "outlined", sx: {
            fontWeight: "bold",
            mx: "auto",
            height: 150,
            width: "100%"
        }, loading: loading, children: (0, jsx_runtime_1.jsx)(StorageProviderDetails_1.default, { image: providerDetails.image, name: providerDetails.name, direction: "column" }) });
}
//# sourceMappingURL=StorageProviderSelector.js.map