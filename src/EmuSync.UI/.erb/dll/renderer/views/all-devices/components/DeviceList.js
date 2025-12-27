"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceList;
const jsx_runtime_1 = require("react/jsx-runtime");
const InfoAlert_1 = __importDefault(require("@/renderer/components/alerts/InfoAlert"));
const LoadingHarness_1 = __importDefault(require("@/renderer/components/harnesses/LoadingHarness"));
const DeleteModal_1 = __importDefault(require("@/renderer/components/modals/DeleteModal"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const material_1 = require("@mui/material");
const OsPlatformLogo_1 = __importDefault(require("@/renderer/components/os-platform/OsPlatformLogo"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const react_1 = __importStar(require("react"));
function DeviceList({ thisDeviceId, query, onDelete }) {
    const [deleteModalIsOpen, setDeleteModalIsOpen] = (0, react_1.useState)(false);
    const [currentDeleteModel, setCurrentDeleteModel] = (0, react_1.useState)(null);
    const handleSuccessfulDelete = (0, react_1.useCallback)((deleteDetails) => {
        setDeleteModalIsOpen(false);
        setCurrentDeleteModel(null);
    }, []);
    const handleDeleteClick = (0, react_1.useCallback)(async (device) => {
        const details = {
            id: device.id,
            nameIdentifier: device.name,
            additionalDetailsComponent: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(InfoAlert_1.default, { content: "Please note: This doesn't delete any save files stored on the device." }), (0, jsx_runtime_1.jsx)(material_1.Divider, {})] })
        };
        setCurrentDeleteModel(details);
        setDeleteModalIsOpen(true);
    }, []);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(LoadingHarness_1.default, { query: query, loadingState: (0, jsx_runtime_1.jsx)(LoadingState, {}), children: query.data &&
                    (0, jsx_runtime_1.jsx)(material_1.List, { disablePadding: true, children: query.data.map((device, index) => {
                            let name = device.name;
                            if (device.id === thisDeviceId) {
                                name += " (this device)";
                            }
                            return (0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.ListItem, { sx: {
                                            py: 2
                                        }, secondaryAction: (0, jsx_runtime_1.jsx)(material_1.IconButton, { edge: "end", title: "Delete this device", onClick: () => handleDeleteClick(device), color: "error", disabled: query.isRefetching, children: (0, jsx_runtime_1.jsx)(Delete_1.default, {}) }), children: [(0, jsx_runtime_1.jsx)(material_1.ListItemAvatar, { children: (0, jsx_runtime_1.jsx)(OsPlatformLogo_1.default, { osPlatform: device.platformId }) }), (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: name })] }), index !== (query.data.length - 1) &&
                                        (0, jsx_runtime_1.jsx)(material_1.Divider, {})] }, device.id);
                        }) }) }), (0, jsx_runtime_1.jsx)(DeleteModal_1.default, { isOpen: deleteModalIsOpen, setIsOpen: setDeleteModalIsOpen, deleteFunction: onDelete, deleteDetails: currentDeleteModel, postDeleteCallback: handleSuccessfulDelete, slotComponent: currentDeleteModel?.additionalDetailsComponent, maxWidth: "sm" })] });
}
function LoadingState() {
    return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Loading devices..." }), (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 16 })] });
}
//# sourceMappingURL=DeviceList.js.map