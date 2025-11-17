"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ShowModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const material_1 = require("@mui/material");
const Dialog_1 = __importDefault(require("@mui/material/Dialog"));
const DialogContent_1 = __importDefault(require("@mui/material/DialogContent"));
const DialogTitle_1 = __importDefault(require("@mui/material/DialogTitle"));
function ShowModal({ isOpen, title, children, maxWidth, paperElevation, showCloseButton, setIsOpen, onClose }) {
    const handleClose = () => {
        setIsOpen(false);
        if (typeof onClose !== "undefined") {
            onClose();
        }
    };
    const showClose = showCloseButton ?? false;
    return (0, jsx_runtime_1.jsxs)(Dialog_1.default, { keepMounted: true, disableEnforceFocus: true, open: isOpen, onClose: handleClose, maxWidth: maxWidth, fullWidth: true, PaperProps: {
            elevation: paperElevation ?? 3
        }, children: [(0, jsx_runtime_1.jsx)(DialogTitle_1.default, { children: title }), (0, jsx_runtime_1.jsx)(material_1.Divider, { variant: "middle" }), (0, jsx_runtime_1.jsx)(DialogContent_1.default, { children: children }), showClose && (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Divider, { variant: "middle" }), (0, jsx_runtime_1.jsx)(VerticalStack_1.default, { sx: { p: 3 }, alignItems: "center", children: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", color: "secondary", onClick: handleClose, sx: {
                                width: {
                                    xs: "100%",
                                    sm: 300
                                }
                            }, children: "Close" }) })] })] });
}
//# sourceMappingURL=ShowModal.js.map