"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SettingsMenu;
const jsx_runtime_1 = require("react/jsx-runtime");
const ColourSchemeSelector_1 = __importDefault(require("@/renderer/layout/Header/ColourSchemeSelector"));
const site_settings_1 = require("@/renderer/site-settings");
const SettingsOutlined_1 = __importDefault(require("@mui/icons-material/SettingsOutlined"));
const material_1 = require("@mui/material");
const react_1 = require("react");
function SettingsMenu() {
    const [anchorElUser, setAnchorElUser] = (0, react_1.useState)(null);
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: handleOpenUserMenu, title: "Open settings", children: (0, jsx_runtime_1.jsx)(SettingsOutlined_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.Menu, { disableScrollLock: true, disablePortal: true, sx: {
                    marginTop: `${site_settings_1.siteSettings.layoutProperties.headerHeight - 20}px`
                }, anchorEl: anchorElUser, anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, keepMounted: true, transformOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }, open: Boolean(anchorElUser), onClose: handleCloseUserMenu, slotProps: {
                    paper: {
                        elevation: 2,
                        sx: {
                            minWidth: 300,
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))'
                        },
                    }
                }, children: (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { px: 1 }, children: (0, jsx_runtime_1.jsx)(material_1.MenuItem, { sx: {
                            cursor: "default",
                            "&:hover": {
                                background: "none"
                            }
                        }, disableTouchRipple: true, children: (0, jsx_runtime_1.jsx)(ColourSchemeSelector_1.default, {}) }) }) })] });
}
//# sourceMappingURL=SettingsMenu.js.map