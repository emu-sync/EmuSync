"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExternalLinkButton;
const jsx_runtime_1 = require("react/jsx-runtime");
const Pre_1 = require("@/renderer/components/Pre");
const material_1 = require("@mui/material");
const OpenInNew_1 = __importDefault(require("@mui/icons-material/OpenInNew"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
function ExternalLinkButton({ href, text }) {
    const openLink = () => {
        window.electron.openExternalLink(href);
    };
    return (0, jsx_runtime_1.jsx)(material_1.Button, { sx: {
            p: 0,
            mx: 0.15,
            minWidth: 0,
            width: "auto",
        }, onClick: openLink, title: `Open ${href} in your browser window`, children: (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { gap: 0.5, children: [(0, jsx_runtime_1.jsx)("span", { children: text }), (0, jsx_runtime_1.jsx)(OpenInNew_1.default, { sx: {
                            mt: -1.25,
                            ml: -0.25,
                            fontSize: "0.75rem"
                        } })] }) }) });
}
//# sourceMappingURL=ExternalLinkButton.js.map