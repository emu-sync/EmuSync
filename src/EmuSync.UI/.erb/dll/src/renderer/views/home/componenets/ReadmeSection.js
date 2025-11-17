"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReadmeSection;
const jsx_runtime_1 = require("react/jsx-runtime");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const ReadmeTitle_1 = __importDefault(require("@/renderer/views/home/componenets/ReadmeTitle"));
function ReadmeSection({ title, children, scrollRef }) {
    return (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { gap: 1, children: [(0, jsx_runtime_1.jsx)(ReadmeTitle_1.default, { title: title, scrollRef: scrollRef }), children] });
}
//# sourceMappingURL=ReadmeSection.js.map