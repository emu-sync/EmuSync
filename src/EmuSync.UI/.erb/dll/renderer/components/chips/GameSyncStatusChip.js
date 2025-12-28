"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSyncStatusChip = GameSyncStatusChip;
const jsx_runtime_1 = require("react/jsx-runtime");
const enums_1 = require("@/renderer/types/enums");
const CloudDone_1 = __importDefault(require("@mui/icons-material/CloudDone"));
const CloudDownload_1 = __importDefault(require("@mui/icons-material/CloudDownload"));
const CloudUpload_1 = __importDefault(require("@mui/icons-material/CloudUpload"));
const FolderOff_1 = __importDefault(require("@mui/icons-material/FolderOff"));
const Help_1 = __importDefault(require("@mui/icons-material/Help"));
const material_1 = require("@mui/material");
const circleSx = {
    borderRadius: "50%",
    padding: 0,
    width: 32,
    height: 32,
    "& .MuiChip-icon": {
        margin: 0
    },
    "& .MuiChip-label": {
        display: "none"
    }
};
function GameSyncStatusChip({ status }) {
    switch (status) {
        case enums_1.GameSyncStatus.RequiresDownload:
            return (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: (0, jsx_runtime_1.jsx)(CloudDownload_1.default, {}), title: "Requires downloading on this device", color: "warning", size: "small", sx: circleSx });
        case enums_1.GameSyncStatus.RequiresUpload:
            return (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: (0, jsx_runtime_1.jsx)(CloudUpload_1.default, {}), title: "Requires uploading from this device", color: "info", size: "small", sx: circleSx });
        case enums_1.GameSyncStatus.InSync:
            return (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: (0, jsx_runtime_1.jsx)(CloudDone_1.default, {}), title: "In Sync with cloud", color: "success", size: "small", sx: circleSx });
        case enums_1.GameSyncStatus.UnsetDirectory:
            return (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: (0, jsx_runtime_1.jsx)(FolderOff_1.default, {}), title: "Directory not set for this device", color: "error", size: "small", sx: circleSx });
        default:
            return (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: (0, jsx_runtime_1.jsx)(Help_1.default, {}), title: "Unknown", color: "default", size: "small", sx: circleSx });
    }
}
//# sourceMappingURL=GameSyncStatusChip.js.map