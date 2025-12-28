"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StorageChip;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const Storage_1 = __importDefault(require("@mui/icons-material/Storage"));
const react_1 = require("react");
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0)
        return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};
function StorageChip({ bytes, size, sx }) {
    const storageSize = (0, react_1.useMemo)(() => {
        return formatBytes(bytes);
    }, [bytes]);
    return (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: (0, jsx_runtime_1.jsx)(Storage_1.default, {}), label: storageSize, size: size ?? "small", title: `The size of all files is ${storageSize}`, sx: sx });
}
//# sourceMappingURL=StorageSizeChip.js.map