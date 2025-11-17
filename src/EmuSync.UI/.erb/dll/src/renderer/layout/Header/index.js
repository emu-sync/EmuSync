"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Header;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const AppLogo_1 = __importDefault(require("@/renderer/components/AppLogo"));
const SettingsMenu_1 = __importDefault(require("@/renderer/layout/Header/SettingsMenu"));
const site_settings_1 = require("@/renderer/site-settings");
const sidebar_config_1 = require("@/renderer/state/sidebar-config");
const Menu_1 = __importDefault(require("@mui/icons-material/Menu"));
const jotai_1 = require("jotai");
const { sidebarTransitionTime, headerHeight, } = site_settings_1.siteSettings.layoutProperties;
function Header({ mobileDrawerToggle, }) {
    const [sidebarConfig, setSidebarConfig] = (0, jotai_1.useAtom)(sidebar_config_1.sidebarConfigAtom);
    const sidebarIsMinimised = sidebarConfig.isMinimised;
    const handleSidebarMinimiseToggle = () => {
        setSidebarConfig(prev => {
            const clone = { ...prev };
            clone.isMinimised = !sidebarIsMinimised;
            return clone;
        });
    };
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(material_1.AppBar, { position: "sticky", color: "transparent", sx: {
                border: "unset",
                boxShadow: "none",
                width: "100%",
                transition: `margin ${sidebarTransitionTime}, width ${sidebarTransitionTime}`,
            }, children: (0, jsx_runtime_1.jsxs)(material_1.Toolbar, { sx: {
                    height: headerHeight,
                    minHeight: headerHeight,
                    color: "text.primary",
                    border: "unset",
                    pl: {
                        md: "0px!important"
                    },
                    background: "unset",
                }, children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "large", edge: "start", color: "inherit", title: "Minimise sidebar", sx: {
                            display: {
                                xs: "none",
                                md: "flex" //only show this button in desktop
                            },
                            ml: 1.5
                        }, onClick: handleSidebarMinimiseToggle, children: (0, jsx_runtime_1.jsx)(Menu_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "large", edge: "start", color: "inherit", title: "Open drawer", sx: {
                            display: {
                                md: "none" //only show this button in mobile
                            }
                        }, onClick: () => mobileDrawerToggle(), children: (0, jsx_runtime_1.jsx)(Menu_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: {
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            justifySelf: "start",
                            mr: "auto",
                            p: 1,
                        }, children: (0, jsx_runtime_1.jsx)(AppLogo_1.default, {}) }), (0, jsx_runtime_1.jsx)(SettingsMenu_1.default, {})] }) }) });
}
//# sourceMappingURL=index.js.map