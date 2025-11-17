"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DangerZone;
const jsx_runtime_1 = require("react/jsx-runtime");
const Container_1 = __importDefault(require("@/renderer/components/Container"));
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const Dangerous_1 = __importDefault(require("@mui/icons-material/Dangerous"));
;
function DangerZone({ children }) {
    return (0, jsx_runtime_1.jsx)(Container_1.default, { children: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "Danger zone", icon: (0, jsx_runtime_1.jsx)(Dangerous_1.default, {}) }), children] }) });
}
//# sourceMappingURL=DangerZone.js.map