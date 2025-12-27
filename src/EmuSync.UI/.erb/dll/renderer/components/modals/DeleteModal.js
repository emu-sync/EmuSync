"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeleteModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const Pre_1 = require("@/renderer/components/Pre");
const VerticalStack_1 = __importDefault(require("@/renderer/components/stacks/VerticalStack"));
const material_1 = require("@mui/material");
const Dialog_1 = __importDefault(require("@mui/material/Dialog"));
const DialogContent_1 = __importDefault(require("@mui/material/DialogContent"));
const DialogTitle_1 = __importDefault(require("@mui/material/DialogTitle"));
const react_1 = require("react");
function DeleteModal({ deleteDetails, isOpen, maxWidth, slotComponent, isLoading, setIsOpen, deleteFunction, postDeleteCallback }) {
    const loading = typeof isLoading !== "undefined" ? isLoading : false;
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [confirmText, setConfirmText] = (0, react_1.useState)("");
    const inputRef = (0, react_1.useRef)(null);
    const handleClose = () => {
        setIsOpen(false);
        setConfirmText("");
    };
    const preventDelete = deleteDetails?.preventDelete || false;
    const deleteIsAllowed = confirmText.toLowerCase() === "confirm";
    (0, react_1.useEffect)(() => {
        if (!isOpen) {
            setConfirmText("");
        }
    }, [isOpen]);
    (0, react_1.useEffect)(() => {
        if (!loading && isOpen && inputRef.current !== null) {
            setTimeout(() => {
                if (inputRef.current !== null) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    }, [isOpen, inputRef, loading]);
    return (0, jsx_runtime_1.jsxs)(Dialog_1.default, { keepMounted: true, disableEnforceFocus: true, open: isOpen, onClose: handleClose, PaperProps: {
            elevation: 3,
            component: 'form',
            onSubmit: async (event) => {
                event.preventDefault();
                if (!deleteIsAllowed)
                    return;
                if (deleteDetails === null)
                    return;
                setIsSubmitting(true);
                try {
                    await deleteFunction(deleteDetails.id);
                    if (postDeleteCallback) {
                        postDeleteCallback(deleteDetails);
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
                finally {
                    setIsSubmitting(false);
                }
            }
        }, maxWidth: maxWidth, fullWidth: true, children: [(0, jsx_runtime_1.jsx)(DialogTitle_1.default, { variant: "h6", children: "Delete item" }), (0, jsx_runtime_1.jsx)(material_1.Divider, { variant: "middle" }), (0, jsx_runtime_1.jsx)(DialogContent_1.default, { children: loading ?
                    (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["Loading information... ", (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 16 })] })
                    :
                        preventDelete ?
                            (0, jsx_runtime_1.jsx)(material_1.Typography, { children: deleteDetails?.preventDeleteReason })
                            :
                                (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(VerticalStack_1.default, { justifyContent: "start", children: (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["You are about to ", (0, jsx_runtime_1.jsx)("strong", { children: "permanently" }), " delete the following item: ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: deleteDetails?.nameIdentifier }), "."] }) }), slotComponent, (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: ["Type the word ", (0, jsx_runtime_1.jsx)(Pre_1.Pre, { children: "confirm" }), " to proceed with the delete."] }), (0, jsx_runtime_1.jsx)(material_1.TextField, { inputRef: inputRef, onChange: (e) => setConfirmText(e.target.value), value: confirmText, disabled: isSubmitting, variant: "outlined" })] }) }), (0, jsx_runtime_1.jsx)(material_1.Divider, { variant: "middle" }), (0, jsx_runtime_1.jsxs)(VerticalStack_1.default, { sx: { p: 3 }, children: [!preventDelete &&
                        (0, jsx_runtime_1.jsx)(material_1.Button, { disabled: !deleteIsAllowed || isSubmitting || loading, loading: isSubmitting, type: "submit", color: "error", variant: "contained", children: "Delete" }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleClose, disabled: isSubmitting || loading, color: "secondary", variant: "contained", children: "Cancel" })] })] });
}
//# sourceMappingURL=DeleteModal.js.map