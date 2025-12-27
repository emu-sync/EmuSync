"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomeScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const AppLogo_1 = __importDefault(require("@/renderer/components/AppLogo"));
const ExternalLinkButton_1 = __importDefault(require("@/renderer/components/buttons/ExternalLinkButton"));
const Container_1 = __importDefault(require("@/renderer/components/Container"));
const LoadingHarness_1 = __importDefault(require("@/renderer/components/harnesses/LoadingHarness"));
const NewReleaseAlert_1 = __importDefault(require("@/renderer/components/NewReleaseAlert"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const use_change_log_1 = require("@/renderer/hooks/use-change-log");
const use_news_1 = require("@/renderer/hooks/use-news");
const use_release_version_checker_1 = require("@/renderer/hooks/use-release-version-checker");
const MarkdownRenderer_1 = __importDefault(require("@/renderer/views/home/componenets/MarkdownRenderer"));
const ReadmeParagraph_1 = __importDefault(require("@/renderer/views/home/componenets/ReadmeParagraph"));
const ReadmeSection_1 = __importDefault(require("@/renderer/views/home/componenets/ReadmeSection"));
const material_1 = require("@mui/material");
const system_1 = require("@mui/system");
const react_1 = require("react");
//TODO: may put in the ability to see previous version change logs
function HomeScreen() {
    const { latestVersion, currentVersion, isNewVersion } = (0, use_release_version_checker_1.useReleaseVersionChecker)();
    const changeLog = (0, use_change_log_1.useChangeLog)();
    const news = (0, use_news_1.useNews)();
    const currentChangeLog = (0, react_1.useMemo)(() => {
        if (!changeLog.data)
            return null;
        return changeLog.data.find(x => x.version === currentVersion || x.version === `v${currentVersion}`) ?? null;
    }, [currentVersion, changeLog.data]);
    const newVersionChangeLog = (0, react_1.useMemo)(() => {
        if (!changeLog.data || !latestVersion)
            return null;
        return changeLog.data.find(x => x.version === latestVersion || x.version === `v${latestVersion}`) ?? null;
    }, [latestVersion, changeLog.data]);
    return (0, jsx_runtime_1.jsxs)(Container_1.default, { children: [(0, jsx_runtime_1.jsx)(system_1.Box, { sx: {
                    height: 75,
                    textAlign: "center",
                    mb: 2
                }, children: (0, jsx_runtime_1.jsx)(AppLogo_1.default, {}) }), (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { gap: 4, children: [isNewVersion &&
                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(NewReleaseAlert_1.default, { latestVersion: latestVersion }), (0, jsx_runtime_1.jsx)(ReadmeSection_1.default, { title: "\uD83D\uDE80 Here's what's new if you update", children: (0, jsx_runtime_1.jsx)(LoadingHarness_1.default, { query: changeLog, loadingState: (0, jsx_runtime_1.jsx)(ChangeLogLoadingState, {}), children: (0, jsx_runtime_1.jsx)(MarkdownRenderer_1.default, { markdown: newVersionChangeLog?.markdown ?? "" }) }) })] }), (0, jsx_runtime_1.jsx)(ReadmeSection_1.default, { title: "\uD83D\uDCE2 What's new in this version?", children: (0, jsx_runtime_1.jsx)(LoadingHarness_1.default, { query: changeLog, loadingState: (0, jsx_runtime_1.jsx)(ChangeLogLoadingState, {}), children: (0, jsx_runtime_1.jsx)(MarkdownRenderer_1.default, { markdown: currentChangeLog?.markdown ?? "" }) }) }), (0, jsx_runtime_1.jsx)(ReadmeSection_1.default, { title: "\u2728 Upcoming features & news", children: (0, jsx_runtime_1.jsx)(LoadingHarness_1.default, { query: changeLog, loadingState: (0, jsx_runtime_1.jsx)(ChangeLogLoadingState, {}), children: (0, jsx_runtime_1.jsx)(MarkdownRenderer_1.default, { markdown: news?.data ?? "### No news" }) }) }), (0, jsx_runtime_1.jsxs)(ReadmeSection_1.default, { title: "\u2753 Need help?", children: [(0, jsx_runtime_1.jsxs)(ReadmeParagraph_1.default, { children: ["Just installed EmuSync, but not sure what to do next? You need to ", (0, jsx_runtime_1.jsx)(ExternalLinkButton_1.default, { href: "https://github.com/emu-sync/EmuSync/wiki/Setting-up-a-storage-provider", text: "Set up a storage provider" }), " before you can set up any game syncs."] }), (0, jsx_runtime_1.jsxs)(ReadmeParagraph_1.default, { children: ["Otherwise, if you're not sure how to do something or have an issue, please see the ", (0, jsx_runtime_1.jsx)(ExternalLinkButton_1.default, { href: "https://github.com/emu-sync/EmuSync/wiki/FAQs", text: "FAQs" }), " page in the wiki, or check out the other pages in the wiki."] })] }), (0, jsx_runtime_1.jsxs)(ReadmeSection_1.default, { title: "\u2764\uFE0F Support EmuSync", children: [(0, jsx_runtime_1.jsxs)(ReadmeParagraph_1.default, { children: ["EmuSync is free and always will be. However, if you like EmuSync and want to support it, you can contribute via our ", (0, jsx_runtime_1.jsx)(ExternalLinkButton_1.default, { href: "https://www.patreon.com/EmuSync", text: "Patreon" }), " page."] }), (0, jsx_runtime_1.jsx)(ReadmeParagraph_1.default, { children: "Many thanks if you want to support EmuSync, but please only do so if want to and can afford to." })] })] })] });
}
function ChangeLogLoadingState() {
    return (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "Loading change log..." }), (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 16 })] });
}
//# sourceMappingURL=HomeScreen.js.map