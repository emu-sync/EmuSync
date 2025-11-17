"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSyncStatusChip = GameSyncStatusChip;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const CloudDownload_1 = __importDefault(require("@mui/icons-material/CloudDownload"));
const CloudUpload_1 = __importDefault(require("@mui/icons-material/CloudUpload"));
const Help_1 = __importDefault(require("@mui/icons-material/Help"));
const CloudDone_1 = __importDefault(require("@mui/icons-material/CloudDone"));
const enums_1 = require("@/renderer/types/enums");
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
            return (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: (0, jsx_runtime_1.jsx)(CloudDownload_1.default, {}), title: "Requires download", color: "warning", size: "small", sx: circleSx });
        case enums_1.GameSyncStatus.RequiresUpload:
            return (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: (0, jsx_runtime_1.jsx)(CloudUpload_1.default, {}), title: "Requires upload", color: "warning", size: "small", sx: circleSx });
        case enums_1.GameSyncStatus.InSync:
            return (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: (0, jsx_runtime_1.jsx)(CloudDone_1.default, {}), title: "In Sync", color: "success", size: "small", sx: circleSx });
        default:
            return (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: (0, jsx_runtime_1.jsx)(Help_1.default, {}), title: "Unknown", color: "default", size: "small", sx: circleSx });
    }
}
//# sourceMappingURL=GameSyncStatusChip.js.map