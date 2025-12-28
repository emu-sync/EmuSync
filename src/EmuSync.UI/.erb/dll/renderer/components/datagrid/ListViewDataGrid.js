"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ListViewDataGrid;
const jsx_runtime_1 = require("react/jsx-runtime");
const CustomToolbar_1 = __importDefault(require("@/renderer/components/datagrid/CustomToolbar"));
const DeleteModal_1 = __importDefault(require("@/renderer/components/modals/DeleteModal"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const material_1 = require("@mui/material");
const system_1 = require("@mui/system");
const x_data_grid_1 = require("@mui/x-data-grid");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
require("./overrides.css");
function ListViewDataGrid({ columns, rows, loading, editHref, addButtonRedirect, addButtonItemName, hasError, reloadFunc, deleteFunc, getDeleteItemDetails }) {
    const [deleteModalIsOpen, setDeleteModalIsOpen] = (0, react_1.useState)(false);
    const [currentDeleteModel, setCurrentDeleteModel] = (0, react_1.useState)(null);
    const Toolbar = (0, react_1.useCallback)(() => {
        return (0, jsx_runtime_1.jsx)(CustomToolbar_1.default, { addButtonRedirect: addButtonRedirect, itemName: addButtonItemName, loading: loading, reloadFunc: reloadFunc, hasError: hasError });
    }, [addButtonRedirect, addButtonItemName, loading, reloadFunc, hasError]);
    const handleDeleteClick = (0, react_1.useCallback)(async (row) => {
        const details = await getDeleteItemDetails(row);
        setCurrentDeleteModel(details);
        setDeleteModalIsOpen(true);
    }, [getDeleteItemDetails]);
    const handleSuccessfulDelete = (0, react_1.useCallback)((deleteDetails) => {
        setDeleteModalIsOpen(false);
        setCurrentDeleteModel(null);
    }, []);
    const gridColumns = (0, react_1.useMemo)(() => {
        const cols = [...columns];
        //push the action column
        cols.push({
            field: "GridActions", headerName: "", minWidth: 75, flex: 1,
            sortable: false,
            filterable: false,
            hideable: false,
            cellClassName: "sticky-cell",
            headerClassName: "sticky-cell",
            renderCell: (params) => {
                return (0, jsx_runtime_1.jsx)(system_1.Box, { sx: { width: "100%", textAlign: "center", zIndex: 100 }, onClick: (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        event.nativeEvent.stopImmediatePropagation();
                        //make the whole cell clickable, so the user doesn't have to be as precise with their click!
                        handleDeleteClick(params.row);
                    }, children: (0, jsx_runtime_1.jsx)(material_1.IconButton, { title: "Delete item", children: (0, jsx_runtime_1.jsx)(Delete_1.default, { color: "error" }) }) });
            }
        });
        return cols;
    }, [columns, handleDeleteClick]);
    const LinkRow = (props) => {
        const href = `${editHref}?id=${props.rowId}`;
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: href, style: { color: "inherit", textDecoration: "none" }, children: (0, jsx_runtime_1.jsx)(x_data_grid_1.GridRow, { ...props }) });
    };
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(x_data_grid_1.DataGrid, { columns: gridColumns, rows: rows, loading: loading, showToolbar: true, disableRowSelectionOnClick: true, slots: {
                    toolbar: Toolbar,
                    row: LinkRow
                } }), (0, jsx_runtime_1.jsx)(DeleteModal_1.default, { isOpen: deleteModalIsOpen, setIsOpen: setDeleteModalIsOpen, deleteFunction: deleteFunc, deleteDetails: currentDeleteModel, postDeleteCallback: handleSuccessfulDelete, slotComponent: currentDeleteModel?.additionalDetailsComponent, maxWidth: "sm" })] });
}
//# sourceMappingURL=ListViewDataGrid.js.map