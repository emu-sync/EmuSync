"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Container;
const jsx_runtime_1 = require("react/jsx-runtime");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
function Container({ children }) {
    return (0, jsx_runtime_1.jsx)(VerticalStack_1.default, { sx: {
            margin: "auto",
            maxWidth: {
                xs: "unset",
                lg: "50%"
            },
            minWidth: {
                xs: "100%",
                lg: 650,
                xl: 800,
            }
        }, children: children });
}
//# sourceMappingURL=Container.js.map