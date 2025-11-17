"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
const jsx_runtime_1 = require("react/jsx-runtime");
const SidebarContent_1 = __importDefault(require("@/renderer/layout/Sidebar/SidebarContent"));
const site_settings_1 = require("@/renderer/site-settings");
const sidebar_config_1 = require("@/renderer/state/sidebar-config");
const material_1 = require("@mui/material");
const jotai_1 = require("jotai");
const { sidebarTransitionTime, sidebarWidth, sidebarMinimisedWidth, headerHeight } = site_settings_1.siteSettings.layoutProperties;
function Sidebar({ mobileDrawerOpen, mobileDrawerToggle }) {
    const [sidebarConfig] = (0, jotai_1.useAtom)(sidebar_config_1.sidebarConfigAtom);
    const sidebarIsMinimised = sidebarConfig.isMinimised;
    const minimiseButtonChevronStyles = {
        color: "text.primary",
        ml: "auto",
        mr: 2
    };
    //apply styles to the "paper" part of the drawer so we can set colours
    const paperStyles = {
        '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarIsMinimised ? sidebarMinimisedWidth : sidebarWidth,
            transition: `width ${sidebarTransitionTime}`,
            border: "unset",
            borderRadius: 0
        },
    };
    const mobileDrawerStyles = {
        display: {
            xs: 'block',
            md: 'none'
        },
        '& .MuiDrawer-paper': {
            ...paperStyles['& .MuiDrawer-paper'],
            width: sidebarWidth
        },
    };
    //don't show sidebar by default in desktop
    const desktopDrawerStyles = {
        display: {
            xs: 'none',
            md: 'block'
        },
        ...paperStyles,
        '& .MuiDrawer-paper': {
            ...paperStyles['& .MuiDrawer-paper'],
            background: "none"
        },
    };
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Drawer, { variant: "temporary", open: mobileDrawerOpen, onClose: () => mobileDrawerToggle(), ModalProps: {
                    keepMounted: true, // Better open performance on mobile.
                }, sx: mobileDrawerStyles, PaperProps: {
                    elevation: 2
                }, children: (0, jsx_runtime_1.jsx)(SidebarContent_1.default, { mobileDrawerToggle: mobileDrawerToggle, sidebarMinimised: false }) }), (0, jsx_runtime_1.jsx)(material_1.Drawer, { variant: "permanent", sx: desktopDrawerStyles, open: true, PaperProps: {
                    sx: {
                        zIndex: 500,
                        boxShadow: "none"
                    },
                    elevation: 1
                }, children: (0, jsx_runtime_1.jsx)(material_1.Stack, { sx: {
                        height: "100%",
                        paddingTop: `${site_settings_1.siteSettings.layoutProperties.headerHeight + 10}px`
                    }, children: (0, jsx_runtime_1.jsx)(SidebarContent_1.default, { mobileDrawerToggle: mobileDrawerToggle, sidebarMinimised: sidebarIsMinimised }) }) })] });
}
//# sourceMappingURL=index.js.map