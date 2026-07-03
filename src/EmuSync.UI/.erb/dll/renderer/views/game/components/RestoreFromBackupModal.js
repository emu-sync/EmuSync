"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RestoreFromBackupModal;
const jsx_runtime_1 = require("react/jsx-runtime");
const DisplayDate_1 = __importDefault(require("@/renderer/components/dates/DisplayDate"));
const ShowModal_1 = __importDefault(require("@/renderer/components/modals/ShowModal"));
const HorizontalStack_1 = __importDefault(require("@/renderer/components/stacks/HorizontalStack"));
const material_1 = require("@mui/material");
const react_1 = __importStar(require("react"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const Close_1 = __importDefault(require("@mui/icons-material/Close"));
function RestoreFromBackupModal({ backups, isOpen, setIsOpen, onSelectBackup, onDeleteBackup }) {
    (0, react_1.useEffect)(() => {
        if (backups.length === 0) {
            setIsOpen(false);
        }
    }, [backups]);
    const orderedBackups = (0, react_1.useMemo)(() => {
        return backups.sort((a, b) => {
            const dateA = new Date(a.createdOnUtc).getTime();
            const dateB = new Date(b.createdOnUtc).getTime();
            return dateB - dateA;
        });
    }, [backups]);
    const BackupsListMemo = (0, react_1.useMemo)(() => {
        return orderedBackups.map((backup, index) => {
            return (0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsx)(BackupListItem, { backup: backup, onSelect: onSelectBackup, onDelete: onDeleteBackup }), index < (orderedBackups.length - 1) &&
                        (0, jsx_runtime_1.jsx)(material_1.Divider, { component: "li" })] }, backup.id);
        });
    }, [orderedBackups, onSelectBackup]);
    return (0, jsx_runtime_1.jsx)(ShowModal_1.default, { isOpen: isOpen, setIsOpen: setIsOpen, title: "Select a backup", showCloseButton: true, maxWidth: "md", children: (0, jsx_runtime_1.jsx)(material_1.List, { component: material_1.Paper, elevation: 3, children: BackupsListMemo }) });
}
function BackupListItem({ backup, onSelect, onDelete }) {
    const [confirmDelete, setConfirmDelete] = (0, react_1.useState)(false);
    const [isDeleting, setIsDeleting] = (0, react_1.useState)(false);
    const date = new Date(backup.createdOnUtc);
    return (0, jsx_runtime_1.jsx)(material_1.ListItem, { sx: {
            my: 1
        }, secondaryAction: confirmDelete ?
            (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "error", size: "small", onClick: async () => {
                            setIsDeleting(true);
                            await onDelete(backup.id);
                        }, title: "Delete this backup", loading: isDeleting, children: "Delete this backup" }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { title: "Cancel delete", onClick: () => setConfirmDelete(false), children: (0, jsx_runtime_1.jsx)(Close_1.default, { color: "secondary" }) })] })
            :
                (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", size: "small", onClick: () => onSelect(backup.id), children: "Use this backup" }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { title: "Delete backup", onClick: () => setConfirmDelete(true), children: (0, jsx_runtime_1.jsx)(Delete_1.default, { color: "error" }) })] }), children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { gap: 0.5, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "A backup taken" }), (0, jsx_runtime_1.jsx)(DisplayDate_1.default, { date: date, displayAsFromNow: true })] }) }) });
}
//# sourceMappingURL=RestoreFromBackupModal.js.map