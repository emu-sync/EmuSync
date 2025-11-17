"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SidebarContent;
const jsx_runtime_1 = require("react/jsx-runtime");
const nav_links_1 = require("@/renderer/layout/Sidebar/nav-links");
const SidebarGroup_1 = __importDefault(require("@/renderer/layout/Sidebar/SidebarGroup"));
function SidebarContent({ mobileDrawerToggle, sidebarMinimised }) {
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: nav_links_1.navLinks.map((group, groupIndex) => {
            return (0, jsx_runtime_1.jsx)(SidebarGroup_1.default, { header: group.name, links: group.links, showText: !sidebarMinimised, onLinkClick: () => mobileDrawerToggle(false) }, `nav-group-${groupIndex}`);
        }) });
}
//# sourceMappingURL=SidebarContent.js.map