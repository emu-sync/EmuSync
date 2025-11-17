"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BackToListButton;
const jsx_runtime_1 = require("react/jsx-runtime");
const LinkButton_1 = __importDefault(require("@/renderer/components/buttons/LinkButton"));
const site_settings_1 = require("@/renderer/site-settings");
const sidebar_config_1 = require("@/renderer/state/sidebar-config");
const ArrowBackIosNew_1 = __importDefault(require("@mui/icons-material/ArrowBackIosNew"));
const material_1 = require("@mui/material");
const jotai_1 = require("jotai");
const { sidebarMinimisedWidth, sidebarWidth, headerHeight, sidebarTransitionTime } = site_settings_1.siteSettings.layoutProperties;
function BackToListButton({ href, ...buttonProps }) {
    const [sidebarConfig] = (0, jotai_1.useAtom)(sidebar_config_1.sidebarConfigAtom);
    const left = sidebarConfig.isMinimised ? sidebarMinimisedWidth : sidebarWidth;
    return (0, jsx_runtime_1.jsx)(material_1.Box
    //gives a pretty nice effect when in full screen
    , { 
        //gives a pretty nice effect when in full screen
        sx: {
            position: {
                xs: "initial",
                lg: "absolute"
            },
            mb: {
                xs: 2,
                lg: 0
            },
            transition: `left ${sidebarTransitionTime}`,
            left: `calc(${left} + 30px)`,
            top: `calc(${headerHeight}px + 30px)`
        }, children: (0, jsx_runtime_1.jsx)(LinkButton_1.default, { href: href, title: "Back to list", buttonStartIcon: (0, jsx_runtime_1.jsx)(ArrowBackIosNew_1.default, {}), ...buttonProps, children: "Back to list" }) });
}
//# sourceMappingURL=BackToListButton.js.map