import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { Button, IconButton } from "@mui/material";
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { Box } from "@mui/system";
import {
    ColumnsPanelTrigger,
    FilterPanelTrigger,
    QuickFilter,
    QuickFilterClear,
    QuickFilterControl,
    QuickFilterTrigger,
    Toolbar,
    ToolbarButton
} from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import CachedIcon from '@mui/icons-material/Cached';
import { useCallback } from "react";
import ErrorAlert from "@/renderer/components/alerts/ErrorAlert";

type OwnerState = {
    expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
    display: 'grid',
    alignItems: 'center',
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => ({
        gridArea: '1 / 1',
        width: 'min-content',
        height: 'min-content',
        zIndex: 1,
        opacity: ownerState.expanded ? 0 : 1,
        pointerEvents: ownerState.expanded ? 'none' : 'auto',
        transition: theme.transitions.create(['opacity']),
    }),
);

const StyledTextField = styled(TextField)<{
    ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    overflowX: 'clip',
    width: ownerState.expanded ? 260 : 'var(--trigger-width)',
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(['width', 'opacity']),
}));

interface CustomToolbarProps {
    addButtonRedirect?: string;
    itemName?: string;
    loading: boolean;
    hasError?: boolean;
    reloadFunc: () => Promise<any>;
}

export default function CustomToolbar({
    addButtonRedirect, itemName, loading,
    reloadFunc, hasError
}: CustomToolbarProps) {

    const handleReloadClick = useCallback(async () => {
        await reloadFunc();
    }, [reloadFunc]);

    return (
        <Toolbar>

            {
                addButtonRedirect &&
                <Box sx={{ mx: 0.5 }}>
                    <Link to={addButtonRedirect}>
                        <Button
                            color="primary"
                            size="small"
                            startIcon={<AddCircleOutlineIcon />}
                            disabled={loading}
                        >
                            Add new {itemName}
                        </Button>
                    </Link>
                </Box>
            }

            <Box
                sx={{
                    flex: 1,
                    mx: 0.5,
                    display: "flex",
                    justifyContent: "center"
                }}>

                {
                    hasError === true &&
                    <ErrorAlert
                        sx={{
                            p: 0,
                            px: 2
                        }}
                        content="An error occurred loading the data"
                    />
                }
            </Box>



            <Tooltip title="Reload data">
                <ToolbarButton
                    disabled={loading}
                    onClick={handleReloadClick}
                >
                    <CachedIcon fontSize="small" />
                </ToolbarButton>
            </Tooltip>

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

            <Tooltip title="Columns">
                <ColumnsPanelTrigger render={<ToolbarButton disabled={loading} />}>
                    <ViewColumnIcon fontSize="small" />
                </ColumnsPanelTrigger>
            </Tooltip>

            <Tooltip title="Filters">
                <FilterPanelTrigger
                    render={(props, state) => (
                        <ToolbarButton {...props} color="default" disabled={loading}>
                            <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                                <FilterListIcon fontSize="small" />
                            </Badge>
                        </ToolbarButton>
                    )}
                />
            </Tooltip>

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />


            <StyledQuickFilter>
                <QuickFilterTrigger
                    render={(triggerProps, state) => (
                        <Tooltip title="Search" enterDelay={0}>
                            <StyledToolbarButton
                                {...triggerProps}
                                ownerState={{ expanded: state.expanded }}
                                color="default"
                                aria-disabled={state.expanded}
                                disabled={loading}
                            >
                                <SearchIcon fontSize="small" />
                            </StyledToolbarButton>
                        </Tooltip>
                    )}
                />
                <QuickFilterControl
                    render={({ ref, ...controlProps }, state) => (
                        <StyledTextField
                            {...controlProps}
                            ownerState={{ expanded: state.expanded }}
                            inputRef={ref}
                            aria-label="Search"
                            placeholder="Search..."
                            size="small"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: state.value ? (
                                        <InputAdornment position="end">
                                            <QuickFilterClear
                                                edge="end"
                                                size="small"
                                                aria-label="Clear search"
                                                material={{ sx: { marginRight: -0.75 } }}
                                            >
                                                <CancelIcon fontSize="small" />
                                            </QuickFilterClear>
                                        </InputAdornment>
                                    ) : null,
                                    ...controlProps.slotProps?.input,
                                },
                                ...controlProps.slotProps,
                            }}
                        />
                    )}
                />
            </StyledQuickFilter>
        </Toolbar>
    );
}