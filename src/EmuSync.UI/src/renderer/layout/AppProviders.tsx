import theme from "@/renderer/layout/theme";
import ClearIcon from '@mui/icons-material/Clear';
import { CssBaseline, GlobalStyles, IconButton, InitColorSchemeScript } from "@mui/material";
import { ThemeProvider, styled } from "@mui/material/styles";
import { Provider as JotaiProvider } from "jotai";
import { SnackbarProvider, closeSnackbar } from 'notistack';

import { MaterialDesignContent } from 'notistack';

import relativeTime from 'dayjs/plugin/relativeTime';
import duration  from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import utc from 'dayjs/plugin/utc'; // import the plugin
import timezone from 'dayjs/plugin/timezone'; // import the plugin

dayjs.extend(relativeTime); //allows the use of the dayjs time plugin. E.g., "... 10 minutes ago"
dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(timezone);

import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            retry: 3, //retry failed queries up to 3 times
        },
    },
});

interface AppProvidersProps {
    children: React.ReactNode;
}

export default function AppProviders({
    children
}: AppProvidersProps) {

    return <QueryClientProvider client={queryClient}>
        <JotaiProvider>
            <InitColorSchemeScript modeStorageKey="theme-mode" attribute="class" />
            <ThemeInitialiser>
                {children}
            </ThemeInitialiser>
        </JotaiProvider>
    </QueryClientProvider>
}

interface ThemeInitialiserProps {
    children: React.ReactNode;
}

function ThemeInitialiser({
    children
}: ThemeInitialiserProps) {

    return <ThemeProvider modeStorageKey="theme-mode" defaultMode="system" theme={theme}>

        {
            //https://mui.com/material-ui/react-text-field/#performance
        }
        <GlobalStyles
            styles={{
                '@keyframes mui-auto-fill': { from: { display: 'block' } },
                '@keyframes mui-auto-fill-cancel': { from: { display: 'block' } },
            }}
        />
        <CssBaseline />
        <CustomSnackbarProvider>
            {children}
        </CustomSnackbarProvider>
    </ThemeProvider>
}


const StyledSnackbar = styled(MaterialDesignContent)(({ theme }) => ({
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


interface CustomSnackbarProviderProps {
    children: React.ReactNode
}


function CustomSnackbarProvider({ children }: CustomSnackbarProviderProps) {

    const domRoot = typeof document === "undefined" ? undefined : document.getElementsByTagName("main")[0];

    return <SnackbarProvider
        Components={{
            success: StyledSnackbar,
            error: StyledSnackbar,
            warning: StyledSnackbar,
            info: StyledSnackbar
        }}
        domRoot={domRoot}
        maxSnack={5}
        autoHideDuration={2500}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        action={(snackbarId) => (
            <IconButton
                onClick={() => closeSnackbar(snackbarId)}
                size="small"
                edge="start"
                color="inherit"
                aria-label="Dismiss notification"
            >
                <ClearIcon />
            </IconButton>
        )}
    >
        {children}
    </SnackbarProvider>
}