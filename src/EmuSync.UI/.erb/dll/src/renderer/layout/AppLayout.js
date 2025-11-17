"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppLayout;
const jsx_runtime_1 = require("react/jsx-runtime");
const Header_1 = __importDefault(require("@/renderer/layout/Header"));
const Sidebar_1 = __importDefault(require("@/renderer/layout/Sidebar"));
const site_settings_1 = require("@/renderer/site-settings");
const sidebar_config_1 = require("@/renderer/state/sidebar-config");
const material_1 = require("@mui/material");
const jotai_1 = require("jotai");
const react_1 = require("react");
const { sidebarTransitionTime, sidebarWidth, sidebarMinimisedWidth } = site_settings_1.siteSettings.layoutProperties;
function AppLayout({ children }) {
    const [mobileDrawerOpen, setMobileDrawerOpen] = (0, react_1.useState)(false);
    const [sidebarConfig] = (0, jotai_1.useAtom)(sidebar_config_1.sidebarConfigAtom);
    const sidebarIsMinimised = sidebarConfig.isMinimised;
    const mainBoxStyles = {
        marginLeft: {
            xs: 0,
            md: sidebarIsMinimised ? sidebarMinimisedWidth : sidebarWidth
        },
        transition: `margin ${sidebarTransitionTime}`,
    };
    const handleMobileDrawerToggle = (forceState) => {
        //sometimes we will always tell this function that it should be closed or open
        //this is fixing a bug where we were unintentionally setting it to open, which was causing the overflow to be hidden on pages that needed it
        if (typeof forceState === "boolean") {
            setMobileDrawerOpen(forceState);
            return;
        }
        setMobileDrawerOpen(!mobileDrawerOpen);
    };
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, { mobileDrawerToggle: handleMobileDrawerToggle }), (0, jsx_runtime_1.jsx)(Sidebar_1.default, { mobileDrawerOpen: mobileDrawerOpen, mobileDrawerToggle: handleMobileDrawerToggle }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: mainBoxStyles, children: (0, jsx_runtime_1.jsx)(material_1.Paper, { sx: {
                        p: 2,
                        mx: site_settings_1.siteSettings.layoutProperties.mainPadding,
                        minHeight: 500,
                        height: `calc(100vh - ${site_settings_1.siteSettings.layoutProperties.headerHeight}px - (${site_settings_1.siteSettings.layoutProperties.mainPadding} * 1.5))`,
                        overflow: "auto"
                    }, elevation: 1, children: children }) })] });
}
//# sourceMappingURL=AppLayout.js.map