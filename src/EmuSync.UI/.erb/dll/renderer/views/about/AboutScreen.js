"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AboutScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const Container_1 = __importDefault(require("@/renderer/components/Container"));
const NewReleaseAlert_1 = __importDefault(require("@/renderer/components/NewReleaseAlert"));
const Pre_1 = require("@/renderer/components/Pre");
const SectionTitle_1 = __importDefault(require("@/renderer/components/SectionTitle"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const use_release_version_checker_1 = require("@/renderer/hooks/use-release-version-checker");
const routes_1 = require("@/renderer/routes");
const material_1 = require("@mui/material");
const Icon = routes_1.routes.about.icon;
function AboutScreen() {
    const { latestVersion, currentVersion, isNewVersion } = (0, use_release_version_checker_1.useReleaseVersionChecker)();
    return (0, jsx_runtime_1.jsx)(Container_1.default, { children: (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(SectionTitle_1.default, { title: "About EmuSync", icon: (0, jsx_runtime_1.jsx)(Icon, {}) }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["You are running version ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: currentVersion }), " of EmuSync."] }), isNewVersion &&
                    (0, jsx_runtime_1.jsx)(NewReleaseAlert_1.default, { latestVersion: latestVersion })] }) });
}
//# sourceMappingURL=AboutScreen.js.map