"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SidebarGroup;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const NavItem_1 = __importDefault(require("@/renderer/layout/Sidebar/NavItem"));
const react_router_dom_1 = require("react-router-dom");
function SidebarGroup({ header, links, showText, onLinkClick }) {
    const location = (0, react_router_dom_1.useLocation)();
    const pathname = location.pathname;
    const expanded = true;
    // const subHeader = <Box
    //     sx={{
    //         px: 3
    //     }}
    // >
    //     {
    //         !showText ?
    //             <Divider
    //                 sx={{
    //                     height: 18,
    //                     mb: 2,
    //                     borderColor: "primary.main",
    //                     opacity: expanded ? 1 : 0
    //                 }}
    //             />
    //             :
    //             <Button
    //                 sx={{
    //                     height: 30,
    //                     width: "113%",
    //                     ml: "-12.5px!important",
    //                 }}
    //                 color="secondary"
    //                 title={expanded ? "Collapse section" : "Expand section"}
    //             >
    //                 <HorizontalStack justifyContent="space-between" sx={{ mr: "-5px!important" }}>
    //                     <Typography color="primary.main" fontSize=".85rem">
    //                         {header}
    //                     </Typography>
    //                     {
    //                         expanded ?
    //                             <ExpandLessIcon color="action" />
    //                             :
    //                             <ExpandMoreIcon color="action" />
    //                     }
    //                 </HorizontalStack>
    //             </Button>
    //     }
    // </Box>
    return (0, jsx_runtime_1.jsx)(material_1.List, { sx: {
            mb: 1,
            py: 0,
            zIndex: 0,
            display: "flex",
            flexDirection: "column",
            gap: 1
        }, children: links.map((link, linkIndex) => {
            //determine if it's selected by reusing the pathMatcher function on the route object
            const selected = link.isSelected(pathname);
            return (0, jsx_runtime_1.jsx)(NavItem_1.default, { href: link.href, linkText: link.linkText, showText: showText, icon: (0, jsx_runtime_1.jsx)(link.icon, {}), onClick: onLinkClick, selected: selected }, `nav-item-${linkIndex}`);
        }) });
}
//# sourceMappingURL=SidebarGroup.js.map