"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomToolbar;
const jsx_runtime_1 = require("react/jsx-runtime");
const AddCircleOutline_1 = __importDefault(require("@mui/icons-material/AddCircleOutline"));
const Cancel_1 = __importDefault(require("@mui/icons-material/Cancel"));
const FilterList_1 = __importDefault(require("@mui/icons-material/FilterList"));
const Search_1 = __importDefault(require("@mui/icons-material/Search"));
const ViewColumn_1 = __importDefault(require("@mui/icons-material/ViewColumn"));
const material_1 = require("@mui/material");
const Badge_1 = __importDefault(require("@mui/material/Badge"));
const Divider_1 = __importDefault(require("@mui/material/Divider"));
const InputAdornment_1 = __importDefault(require("@mui/material/InputAdornment"));
const styles_1 = require("@mui/material/styles");
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const Tooltip_1 = __importDefault(require("@mui/material/Tooltip"));
const system_1 = require("@mui/system");
const x_data_grid_1 = require("@mui/x-data-grid");
const react_router_dom_1 = require("react-router-dom");
const Cached_1 = __importDefault(require("@mui/icons-material/Cached"));
const react_1 = require("react");
const ErrorAlert_1 = __importDefault(require("@/renderer/components/alerts/ErrorAlert"));
const StyledQuickFilter = (0, styles_1.styled)(x_data_grid_1.QuickFilter)({
    display: 'grid',
    alignItems: 'center',
});
const StyledToolbarButton = (0, styles_1.styled)(x_data_grid_1.ToolbarButton)(({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
}));
const StyledTextField = (0, styles_1.styled)(TextField_1.default)(({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    overflowX: 'clip',
    width: ownerState.expanded ? 260 : 'var(--trigger-width)',
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(['width', 'opacity']),
}));
function CustomToolbar({ addButtonRedirect, itemName, loading, reloadFunc, hasError }) {
    const handleReloadClick = (0, react_1.useCallback)(async () => {
        await reloadFunc();
    }, [reloadFunc]);
    return ((0, jsx_runtime_1.jsxs)(x_data_grid_1.Toolbar, { children: [(0, jsx_runtime_1.jsx)(system_1.Box, { sx: { mx: 0.5 }, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: addButtonRedirect, children: (0, jsx_runtime_1.jsxs)(material_1.Button, { color: "primary", size: "small", startIcon: (0, jsx_runtime_1.jsx)(AddCircleOutline_1.default, {}), disabled: loading, children: ["Add new ", itemName] }) }) }), (0, jsx_runtime_1.jsx)(system_1.Box, { sx: {
                    flex: 1,
                    mx: 0.5,
                    display: "flex",
                    justifyContent: "center"
                }, children: hasError === true &&
                    (0, jsx_runtime_1.jsx)(ErrorAlert_1.default, { sx: {
                            p: 0,
                            px: 2
                        }, content: "An error occurred loading the data" }) }), (0, jsx_runtime_1.jsx)(Tooltip_1.default, { title: "Reload data", children: (0, jsx_runtime_1.jsx)(x_data_grid_1.ToolbarButton, { disabled: loading, onClick: handleReloadClick, children: (0, jsx_runtime_1.jsx)(Cached_1.default, { fontSize: "small" }) }) }), (0, jsx_runtime_1.jsx)(Divider_1.default, { orientation: "vertical", variant: "middle", flexItem: true, sx: { mx: 0.5 } }), (0, jsx_runtime_1.jsx)(Tooltip_1.default, { title: "Columns", children: (0, jsx_runtime_1.jsx)(x_data_grid_1.ColumnsPanelTrigger, { render: (0, jsx_runtime_1.jsx)(x_data_grid_1.ToolbarButton, { disabled: loading }), children: (0, jsx_runtime_1.jsx)(ViewColumn_1.default, { fontSize: "small" }) }) }), (0, jsx_runtime_1.jsx)(Tooltip_1.default, { title: "Filters", children: (0, jsx_runtime_1.jsx)(x_data_grid_1.FilterPanelTrigger, { render: (props, state) => ((0, jsx_runtime_1.jsx)(x_data_grid_1.ToolbarButton, { ...props, color: "default", disabled: loading, children: (0, jsx_runtime_1.jsx)(Badge_1.default, { badgeContent: state.filterCount, color: "primary", variant: "dot", children: (0, jsx_runtime_1.jsx)(FilterList_1.default, { fontSize: "small" }) }) })) }) }), (0, jsx_runtime_1.jsx)(Divider_1.default, { orientation: "vertical", variant: "middle", flexItem: true, sx: { mx: 0.5 } }), (0, jsx_runtime_1.jsxs)(StyledQuickFilter, { children: [(0, jsx_runtime_1.jsx)(x_data_grid_1.QuickFilterTrigger, { render: (triggerProps, state) => ((0, jsx_runtime_1.jsx)(Tooltip_1.default, { title: "Search", enterDelay: 0, children: (0, jsx_runtime_1.jsx)(StyledToolbarButton, { ...triggerProps, ownerState: { expanded: state.expanded }, color: "default", "aria-disabled": state.expanded, disabled: loading, children: (0, jsx_runtime_1.jsx)(Search_1.default, { fontSize: "small" }) }) })) }), (0, jsx_runtime_1.jsx)(x_data_grid_1.QuickFilterControl, { render: ({ ref, ...controlProps }, state) => ((0, jsx_runtime_1.jsx)(StyledTextField, { ...controlProps, ownerState: { expanded: state.expanded }, inputRef: ref, "aria-label": "Search", placeholder: "Search...", size: "small", slotProps: {
                                input: {
                                    startAdornment: ((0, jsx_runtime_1.jsx)(InputAdornment_1.default, { position: "start", children: (0, jsx_runtime_1.jsx)(Search_1.default, { fontSize: "small" }) })),
                                    endAdornment: state.value ? ((0, jsx_runtime_1.jsx)(InputAdornment_1.default, { position: "end", children: (0, jsx_runtime_1.jsx)(x_data_grid_1.QuickFilterClear, { edge: "end", size: "small", "aria-label": "Clear search", material: { sx: { marginRight: -0.75 } }, children: (0, jsx_runtime_1.jsx)(Cancel_1.default, { fontSize: "small" }) }) })) : null,
                                    ...controlProps.slotProps?.input,
                                },
                                ...controlProps.slotProps,
                            } })) })] })] }));
}
//# sourceMappingURL=CustomToolbar.js.map