"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppProviders;
const jsx_runtime_1 = require("react/jsx-runtime");
const theme_1 = __importDefault(require("@/renderer/layout/theme"));
const Clear_1 = __importDefault(require("@mui/icons-material/Clear"));
const material_1 = require("@mui/material");
const styles_1 = require("@mui/material/styles");
const jotai_1 = require("jotai");
const notistack_1 = require("notistack");
const notistack_2 = require("notistack");
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
const dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/en-gb");
dayjs_1.default.extend(relativeTime_1.default); //allows the use of the dayjs time plugin. E.g., "... 10 minutes ago"
const react_query_1 = require("@tanstack/react-query");
const queryClient = new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            retry: 3, //retry failed queries up to 3 times
        },
    },
});
function AppProviders({ children }) {
    return (0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: (0, jsx_runtime_1.jsxs)(jotai_1.Provider, { children: [(0, jsx_runtime_1.jsx)(material_1.InitColorSchemeScript, { modeStorageKey: "theme-mode", attribute: "class" }), (0, jsx_runtime_1.jsx)(ThemeInitialiser, { children: children })] }) });
}
function ThemeInitialiser({ children }) {
    return (0, jsx_runtime_1.jsxs)(styles_1.ThemeProvider, { modeStorageKey: "theme-mode", defaultMode: "system", theme: theme_1.default, children: [(0, jsx_runtime_1.jsx)(material_1.GlobalStyles, { styles: {
                    '@keyframes mui-auto-fill': { from: { display: 'block' } },
                    '@keyframes mui-auto-fill-cancel': { from: { display: 'block' } },
                } }), (0, jsx_runtime_1.jsx)(material_1.CssBaseline, {}), (0, jsx_runtime_1.jsx)(CustomSnackbarProvider, { children: children })] });
}
const StyledSnackbar = (0, styles_1.styled)(notistack_2.MaterialDesignContent)(({ theme }) => ({
    '&.notistack-MuiContent-success': {
        backgroundColor: theme.vars?.palette.success.main,
        color: theme.vars?.palette.success.contrastText,
    },
    '&.notistack-MuiContent-error': {
        backgroundColor: theme.vars?.palette.error.main,
        color: theme.vars?.palette.error.contrastText,
    },
    '&.notistack-MuiContent-warning': {
        backgroundColor: theme.vars?.palette.warning.main,
        color: theme.vars?.palette.warning.contrastText,
    },
    '&.notistack-MuiContent-info': {
        backgroundColor: theme.vars?.palette.info.main,
        color: theme.vars?.palette.info.contrastText,
    },
}));
function CustomSnackbarProvider({ children }) {
    const domRoot = typeof document === "undefined" ? undefined : document.getElementsByTagName("main")[0];
    return (0, jsx_runtime_1.jsx)(notistack_1.SnackbarProvider, { Components: {
            success: StyledSnackbar,
            error: StyledSnackbar,
            warning: StyledSnackbar,
            info: StyledSnackbar
        }, domRoot: domRoot, maxSnack: 5, autoHideDuration: 2500, anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
        }, action: (snackbarId) => ((0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: () => (0, notistack_1.closeSnackbar)(snackbarId), size: "small", edge: "start", color: "inherit", "aria-label": "Dismiss notification", children: (0, jsx_runtime_1.jsx)(Clear_1.default, {}) })), children: children });
}
//# sourceMappingURL=AppProviders.js.map