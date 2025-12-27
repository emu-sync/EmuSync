"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncTypeChip = SyncTypeChip;
const jsx_runtime_1 = require("react/jsx-runtime");
const enums_1 = require("@/renderer/types/enums");
const CloudDownload_1 = __importDefault(require("@mui/icons-material/CloudDownload"));
const CloudUpload_1 = __importDefault(require("@mui/icons-material/CloudUpload"));
const material_1 = require("@mui/material");
function SyncTypeChip({ syncType, sx }) {
    switch (syncType) {
        case enums_1.SyncType.Download:
            return (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: (0, jsx_runtime_1.jsx)(CloudDownload_1.default, {}), label: "Downloaded", title: "The game files were downloaded to this device", color: "warning", sx: sx });
        case enums_1.SyncType.Upload:
            return (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: (0, jsx_runtime_1.jsx)(CloudUpload_1.default, {}), label: "Uploaded", title: "The game files were uploaded from this device", color: "info", sx: sx });
        default:
            return undefined;
    }
}
//# sourceMappingURL=SyncTypeChip.js.map