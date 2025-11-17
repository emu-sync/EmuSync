"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomeScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const AppLogo_1 = __importDefault(require("@/renderer/components/AppLogo"));
const Container_1 = __importDefault(require("@/renderer/components/Container"));
const Pre_1 = require("@/renderer/components/Pre");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const routes_1 = require("@/renderer/routes");
const FAQ_1 = __importDefault(require("@/renderer/views/home/componenets/FAQ"));
const ReadmeList_1 = __importDefault(require("@/renderer/views/home/componenets/ReadmeList"));
const ReadmeParagraph_1 = __importDefault(require("@/renderer/views/home/componenets/ReadmeParagraph"));
const ReadmeSection_1 = __importDefault(require("@/renderer/views/home/componenets/ReadmeSection"));
const ReadmeSubSection_1 = __importDefault(require("@/renderer/views/home/componenets/ReadmeSubSection"));
const ScrollLink_1 = __importDefault(require("@/renderer/views/home/componenets/ScrollLink"));
const material_1 = require("@mui/material");
const system_1 = require("@mui/system");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
function HomeScreen() {
    const whatsNewRef = (0, react_1.useRef)(null);
    const gettingStartedRef = (0, react_1.useRef)(null);
    const faqsRef = (0, react_1.useRef)(null);
    const supportRef = (0, react_1.useRef)(null);
    const openPatreon = () => {
        window.electron.openExternalLink("https://www.patreon.com/EmuSync");
    };
    return (0, jsx_runtime_1.jsxs)(Container_1.default, { children: [(0, jsx_runtime_1.jsx)(system_1.Box, { sx: {
                    height: 75,
                    textAlign: "center",
                    mb: 2
                }, children: (0, jsx_runtime_1.jsx)(AppLogo_1.default, {}) }), (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { gap: 5, children: [(0, jsx_runtime_1.jsx)(ReadmeList_1.default, { listStyle: "disc", list: [
                            (0, jsx_runtime_1.jsx)(ScrollLink_1.default, { scrollRef: whatsNewRef, children: "What's new?" }),
                            (0, jsx_runtime_1.jsx)(ScrollLink_1.default, { scrollRef: gettingStartedRef, children: "Getting Started" }),
                            (0, jsx_runtime_1.jsx)(ScrollLink_1.default, { scrollRef: faqsRef, children: "FAQs" }),
                            (0, jsx_runtime_1.jsx)(ScrollLink_1.default, { scrollRef: supportRef, children: "Support EmuSync" }),
                        ] }), (0, jsx_runtime_1.jsx)(ReadmeSection_1.default, { title: "\uD83D\uDCE2 What's new?", scrollRef: whatsNewRef, children: (0, jsx_runtime_1.jsx)(ReadmeParagraph_1.default, { children: "This is the launch version of EmuSync - thanks for downloading! This section should help you get started and answer any questions or problems you might have with EmuSync." }) }), (0, jsx_runtime_1.jsxs)(ReadmeSection_1.default, { title: "\uD83D\uDE80 Getting Started", scrollRef: gettingStartedRef, children: [(0, jsx_runtime_1.jsx)(ReadmeParagraph_1.default, { children: "With EmuSync installed, you first need to log in to your storage provider. This is where EmuSync will store your game saves, as well as using it as a pseudo database, which keeps EmuSync free!" }), (0, jsx_runtime_1.jsx)(ReadmeSubSection_1.default, { title: "\uD83D\uDCBE Setting up a storage provider", children: (0, jsx_runtime_1.jsx)(ReadmeList_1.default, { listStyle: "decimal", list: [
                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Go to ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: routes_1.routes.thisDevice.href, children: routes_1.routes.thisDevice.title }), "."] }),
                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["In the ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "Storage provider" }), " section, select one of the available storage providers."] }),
                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "A window should pop up, prompting you to log in and grant EmuSync permission." }),
                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "After you've successfully logged in, close the window." }),
                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "You should now see your linked storage provider!" })
                                    ] }) }), (0, jsx_runtime_1.jsx)(ReadmeParagraph_1.default, { children: "Now you've linked a storage provider, you can start defining your games and where their save locations are." }), (0, jsx_runtime_1.jsx)(ReadmeSubSection_1.default, { title: "\uD83C\uDFAE Setting up a game sync", children: (0, jsx_runtime_1.jsx)(ReadmeList_1.default, { listStyle: "decimal", list: [
                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Go to ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: routes_1.routes.game.href, children: routes_1.routes.game.title }), "."] }),
                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["In the top left, use the ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "Add new game" }), " button."] }),
                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "Enter a name for the game." }),
                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["If you want EmuSync to keep the game synced in the background, check the ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "Automatically sync this game?" }), " checkbox."] }),
                                        (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "Enter the sync locations for each device you have connected to EmuSync." }),
                                        (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Use the ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "Save changes" }), " button."] }),
                                    ] }) }), (0, jsx_runtime_1.jsx)(ReadmeParagraph_1.default, { children: "To edit an existing game, click on it in the games list. Here you'll be able to see the sync status for game, as well as manually sync the save files on the device." })] }), (0, jsx_runtime_1.jsxs)(ReadmeSection_1.default, { title: "\u2753 FAQs", scrollRef: faqsRef, children: [(0, jsx_runtime_1.jsxs)(FAQ_1.default, { title: "EmuSync is slow", children: [(0, jsx_runtime_1.jsx)(ReadmeParagraph_1.default, { children: "EmuSync uses your cloud storage provider as a pseudo document storage database - this is what keeps EmuSync free, because we don't pay any hosting costs!" }), (0, jsx_runtime_1.jsx)(ReadmeParagraph_1.default, { children: "Cloud storage providers are not designed to work in this way, so unfortunately EmuSync is at the mercy of the latency from your cloud storage provider." })] }), (0, jsx_runtime_1.jsxs)(FAQ_1.default, { title: `What does "The EmuSync agent is not running." mean?`, children: [(0, jsx_runtime_1.jsx)(ReadmeParagraph_1.default, { children: "The EmuSync agent is a separate process that needs to run on your device. It handles automatic syncing in the background, but is also the back-end to this application. If it's not running, you'll need to start it." }), (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { sx: { p: 3, pb: 0 }, gap: 1, children: [(0, jsx_runtime_1.jsx)(ReadmeParagraph_1.default, { children: "To start it on Windows:" }), (0, jsx_runtime_1.jsx)(ReadmeList_1.default, { listStyle: "decimal", list: [
                                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "Press Win + R." }),
                                                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Type ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "services.msc" }), " and press the ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "OK" }), " button."] }),
                                                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["In the service list, look for ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "EmuSyncAgent" }), " and right click on it."] }),
                                                    (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: ["Use the ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "Start" }), " option and wait for the service to start."] })
                                                ] })] }), (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { sx: { p: 3, pb: 0 }, gap: 1, children: [(0, jsx_runtime_1.jsx)(ReadmeParagraph_1.default, { children: "To start it on Linux:" }), (0, jsx_runtime_1.jsx)(ReadmeList_1.default, { listStyle: "decimal", list: [
                                                    (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: "TODO." }),
                                                ] })] })] }), (0, jsx_runtime_1.jsx)(FAQ_1.default, { title: "What games/emulators work with EmuSync?", children: (0, jsx_runtime_1.jsx)(ReadmeParagraph_1.default, { children: "Any! In fact, EmuSync doesn't even know or care about which games or emulators you use, it just syncs the contents of a folder." }) })] }), (0, jsx_runtime_1.jsxs)(ReadmeSection_1.default, { title: "\u2764\uFE0F Support EmuSync", scrollRef: supportRef, children: [(0, jsx_runtime_1.jsxs)(ReadmeParagraph_1.default, { children: ["EmuSync is free and always will be. However, if you like EmuSync and want to support it, you can contribute via our", (0, jsx_runtime_1.jsx)(material_1.Button, { sx: {
                                            p: 0,
                                            mx: 0.75,
                                            minWidth: 0,
                                            width: "auto"
                                        }, onClick: openPatreon, children: (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "Patreon" }) }), "page."] }), (0, jsx_runtime_1.jsx)(ReadmeParagraph_1.default, { children: "Many thanks if you want to support EmuSync, but please only contribute if want to and can afford to." })] })] })] });
}
//# sourceMappingURL=HomeScreen.js.map