"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ThisDeviceScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const Container_1 = __importDefault(require("@/renderer/components/Container"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const ApiStatus_1 = __importDefault(require("@/renderer/views/this-device/components/ApiStatus"));
const GameScanForm_1 = __importDefault(require("@/renderer/views/this-device/forms/GameScanForm"));
const StorageProviderForm_1 = __importDefault(require("@/renderer/views/this-device/forms/StorageProviderForm"));
const SyncSourceForm_1 = __importDefault(require("@/renderer/views/this-device/forms/SyncSourceForm"));
const material_1 = require("@mui/material");
function ThisDeviceScreen() {
    return (0, jsx_runtime_1.jsx)(Container_1.default, { children: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(SyncSourceForm_1.default, {}), (0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(GameScanForm_1.default, {}), (0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(ApiStatus_1.default, {}), (0, jsx_runtime_1.jsx)(material_1.Divider, {}), (0, jsx_runtime_1.jsx)(StorageProviderForm_1.default, {})] }) });
}
//# sourceMappingURL=ThisDeviceScreen.js.map