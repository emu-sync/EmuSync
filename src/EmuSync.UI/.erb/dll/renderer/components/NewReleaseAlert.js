"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NewReleaseAlert;
const jsx_runtime_1 = require("react/jsx-runtime");
const InfoAlert_1 = __importDefault(require("@/renderer/components/alerts/InfoAlert"));
const ExternalLinkButton_1 = __importDefault(require("@/renderer/components/buttons/ExternalLinkButton"));
const Pre_1 = require("@/renderer/components/Pre");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const material_1 = require("@mui/material");
function NewReleaseAlert({ latestVersion }) {
    return (0, jsx_runtime_1.jsx)(InfoAlert_1.default, { content: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["There's a new version of EmuSync available: ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: latestVersion }), ". You can view the release on our ", (0, jsx_runtime_1.jsx)(ExternalLinkButton_1.default, { href: "https://github.com/emu-sync/EmuSync/releases/latest", text: "Github releases" }), " page."] }), (0, jsx_runtime_1.jsx)(ReleaseDownloadInformation, {})] }) });
}
function ReleaseDownloadInformation() {
    if (window.electron.isLinux) {
        return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["To update your version, please run the installer again and choose the ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "Update EmuSync" }), " option."] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["If you no longer have the installer, you can download it ", (0, jsx_runtime_1.jsx)(ExternalLinkButton_1.default, { href: "https://github.com/emu-sync/EmuSync-LinuxInstaller/releases/latest/download/EmuSync-LinuxInstaller.desktop", text: "here" }), "."] })] });
    }
    if (window.electron.isWindows) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["To update your version, please download the ", (0, jsx_runtime_1.jsx)(ExternalLinkButton_1.default, { href: "https://github.com/emu-sync/EmuSync/releases/latest/download/EmuSync-Win-x64.exe", text: "latest installer" }), " and run it."] }) });
    }
    //fallthrough - mac, but not supporting that right now
    return (0, jsx_runtime_1.jsx)(material_1.Typography, { children: "To update your version, go to the latest release page and download it." });
}
//# sourceMappingURL=NewReleaseAlert.js.map