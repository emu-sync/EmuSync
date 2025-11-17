'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NavItem;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const react_router_dom_1 = require("react-router-dom");
function NavItem({ href, linkText, showText, icon, onClick, selected }) {
    const theme = (0, material_1.useTheme)();
    const textColour = "text.primary";
    const brightenedColour = (0, material_1.lighten)(theme.palette.primary.main, 0.3);
    const buttonStyles = {
        pl: 1,
        py: 1.5,
        color: textColour,
        borderTopRightRadius: {
            xs: 0,
            md: 15
        },
        borderBottomRightRadius: {
            xs: 0,
            md: 15
        },
        borderLeft: `5px solid transparent`,
        "&.Mui-selected": {
            borderColor: "primary.main",
            color: "primary.main",
            backgroundColor: (0, material_1.alpha)(brightenedColour, 0.075)
        },
        height: 45,
        fontSize: "0.85rem"
    };
    const iconStyles = {
        color: selected ? "primary.main" : textColour,
        ml: 1.5
    };
    //aligns the image to the center a bit beter
    if (!showText) {
        iconStyles.minWidth = 30;
    }
    return (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: href, onClick: onClick, style: { textDecoration: "none" }, title: linkText, children: (0, jsx_runtime_1.jsxs)(material_1.ListItemButton, { sx: buttonStyles, selected: selected, children: [(0, jsx_runtime_1.jsx)(material_1.ListItemIcon, { sx: iconStyles, children: icon }), showText &&
                    (0, jsx_runtime_1.jsx)(material_1.ListItemText, { sx: { textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", ml: "-10px" }, disableTypography: true, children: linkText })] }) });
}
//# sourceMappingURL=NavItem.js.map