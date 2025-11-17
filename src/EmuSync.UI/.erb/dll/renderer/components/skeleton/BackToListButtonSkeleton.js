"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BackToListButtonSkeleton;
const jsx_runtime_1 = require("react/jsx-runtime");
const site_settings_1 = require("@/renderer/site-settings");
const sidebar_config_1 = require("@/renderer/state/sidebar-config");
const material_1 = require("@mui/material");
const jotai_1 = require("jotai");
const { sidebarMinimisedWidth, sidebarWidth, headerHeight, sidebarTransitionTime } = site_settings_1.siteSettings.layoutProperties;
function BackToListButtonSkeleton() {
    const [sidebarConfig] = (0, jotai_1.useAtom)(sidebar_config_1.sidebarConfigAtom);
    const left = sidebarConfig.isMinimised ? sidebarMinimisedWidth : sidebarWidth;
    return (0, jsx_runtime_1.jsx)(material_1.Box, { sx: {
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
        }, children: (0, jsx_runtime_1.jsx)(material_1.Skeleton, { variant: "rounded", width: 115, height: 37, sx: {
                borderRadius: 50
            } }) });
}
//# sourceMappingURL=BackToListButtonSkeleton.js.map