"use strict";
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
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
function RestoreFromBackupModal({ backups, isOpen, setIsOpen, onSelectBackup }) {
    const orderedBackups = (0, react_2.useMemo)(() => {
        return backups.sort((a, b) => {
            const dateA = new Date(a.createdOnUtc).getTime();
            const dateB = new Date(b.createdOnUtc).getTime();
            return dateB - dateA;
        });
    }, [backups]);
    const BackupsListMemo = (0, react_2.useMemo)(() => {
        return orderedBackups.map((backup, index) => {
            const date = new Date(backup.createdOnUtc);
            return (0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.ListItem, { secondaryAction: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", size: "small", onClick: () => onSelectBackup(backup.id), children: "Use this backup" }), children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: (0, jsx_runtime_1.jsxs)(HorizontalStack_1.default, { gap: 0.5, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { children: "A backup taken" }), (0, jsx_runtime_1.jsx)(DisplayDate_1.default, { date: date, displayAsFromNow: true })] }) }) }), index < (orderedBackups.length - 1) &&
                        (0, jsx_runtime_1.jsx)(material_1.Divider, { component: "li" })] }, backup.id);
        });
    }, [orderedBackups]);
    return (0, jsx_runtime_1.jsx)(ShowModal_1.default, { isOpen: isOpen, setIsOpen: setIsOpen, title: "Select a backup", showCloseButton: true, maxWidth: "md", children: (0, jsx_runtime_1.jsx)(material_1.List, { children: BackupsListMemo }) });
}
//# sourceMappingURL=RestoreFromBackupModal.js.map