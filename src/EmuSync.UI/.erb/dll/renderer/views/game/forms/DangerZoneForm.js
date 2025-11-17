"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DangerZoneForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const cache_keys_1 = require("@/renderer/api/cache-keys");
const game_api_1 = require("@/renderer/api/game-api");
const ErrorAlert_1 = __importDefault(require("@/renderer/components/alerts/ErrorAlert"));
const InfoAlert_1 = __importDefault(require("@/renderer/components/alerts/InfoAlert"));
const DangerZone_1 = __importDefault(require("@/renderer/components/DangerZone"));
const DeleteModal_1 = __importDefault(require("@/renderer/components/modals/DeleteModal"));
const use_alerts_1 = __importDefault(require("@/renderer/hooks/use-alerts"));
const routes_1 = require("@/renderer/routes");
const material_1 = require("@mui/material");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
;
function DangerZoneForm({ game }) {
    const queryClient = (0, react_query_1.useQueryClient)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { successAlert, errorAlert } = (0, use_alerts_1.default)();
    const deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: game_api_1.deleteGame,
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: [cache_keys_1.cacheKeys.gameList] });
            successAlert(`Successfully deleted game: ${game.name}`);
            navigate(`${routes_1.routes.game.href}`);
        },
        onError: () => {
            errorAlert(`Failed to delete game: ${game.name}`);
        },
    });
    const [deleteModalIsOpen, setDeleteModalIsOpen] = (0, react_1.useState)(false);
    const [currentDeleteModel, setCurrentDeleteModel] = (0, react_1.useState)(null);
    const handleDelete = (0, react_1.useCallback)((id) => {
        return deleteMutation.mutateAsync(id);
    }, [deleteMutation]);
    const handleDeleteClick = (0, react_1.useCallback)(() => {
        const details = {
            id: game.id,
            nameIdentifier: game.name,
            additionalDetailsComponent: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(InfoAlert_1.default, { content: "Please note: This doesn't delete any local save files for the game." }), (0, jsx_runtime_1.jsx)(material_1.Divider, {})] })
        };
        setCurrentDeleteModel(details);
        setDeleteModalIsOpen(true);
    }, [game]);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(DangerZone_1.default, { children: (0, jsx_runtime_1.jsx)(ErrorAlert_1.default, { content: "Permanent delete this game.", action: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", color: "error", size: "small", onClick: handleDeleteClick, children: "Delete" }) }) }), (0, jsx_runtime_1.jsx)(DeleteModal_1.default, { isOpen: deleteModalIsOpen, setIsOpen: setDeleteModalIsOpen, deleteFunction: handleDelete, deleteDetails: currentDeleteModel, slotComponent: currentDeleteModel?.additionalDetailsComponent, maxWidth: "sm" })] });
}
//# sourceMappingURL=DangerZoneForm.js.map