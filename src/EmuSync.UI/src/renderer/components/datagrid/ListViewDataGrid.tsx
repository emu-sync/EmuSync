import CustomToolbar from "@/renderer/components/datagrid/CustomToolbar";
import DeleteModal, { DeleteItemDetails } from "@/renderer/components/modals/DeleteModal";
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import { Box } from "@mui/system";

import { DataGrid, GridColDef, GridRow, GridRowProps } from '@mui/x-data-grid';
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import "./overrides.css"

interface ListViewDataGridProps<TData> {
    columns: GridColDef[];
    rows: TData[];
    loading: boolean;
    editHref: string;
    addButtonRedirect: string;
    addButtonItemName: string;
    hasError?: boolean;
    reloadFunc: () => Promise<any>;
    deleteFunc: (id: string) => Promise<any>;
    getDeleteItemDetails: (row: TData) => Promise<DeleteItemDetails>;
}

export default function ListViewDataGrid<TData>({
    columns, rows, loading, editHref,
    addButtonRedirect, addButtonItemName, hasError,
    reloadFunc,
    deleteFunc, getDeleteItemDetails
}: ListViewDataGridProps<TData>) {

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [currentDeleteModel, setCurrentDeleteModel] = useState<DeleteItemDetails | null>(null);

    const Toolbar = useCallback(() => {
        return <CustomToolbar
            addButtonRedirect={addButtonRedirect}
            itemName={addButtonItemName}
            loading={loading}
            reloadFunc={reloadFunc}
            hasError={hasError}
        />
    }, [addButtonRedirect, addButtonItemName, loading, reloadFunc, hasError]);

    const handleDeleteClick = useCallback(async (row: TData) => {

        const details = await getDeleteItemDetails(row);

        setCurrentDeleteModel(details);
        setDeleteModalIsOpen(true);

    }, [getDeleteItemDetails]);

    const handleSuccessfulDelete = useCallback((deleteDetails: DeleteItemDetails) => {

        setDeleteModalIsOpen(false);
        setCurrentDeleteModel(null);
    }, []);

    const gridColumns = useMemo(() => {

        const cols = [...columns];

        //push the action column

        cols.push(
            {
                field: "GridActions", headerName: "", minWidth: 75, flex: 1,
                sortable: false,
                filterable: false,
                hideable: false,
                cellClassName: "sticky-cell",
                headerClassName: "sticky-cell",
                renderCell: (params) => {

                    return <Box sx={{ width: "100%", textAlign: "center", zIndex: 100 }}
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            event.nativeEvent.stopImmediatePropagation();

                            //make the whole cell clickable, so the user doesn't have to be as precise with their click!
                            handleDeleteClick(params.row);
                        }}>
                        <IconButton
                            title="Delete item"
                        >
                            <DeleteIcon
                                color="error"
                            />
                        </IconButton>
                    </Box>
                }
            }
        );

        return cols;

    }, [columns, handleDeleteClick]);

    const LinkRow = (props: GridRowProps) => {

        const href = `${editHref}?id=${props.rowId}`;

        return <Link
            to={href}
            style={{ color: "inherit", textDecoration: "none" }}
        >
            <GridRow {...props} />
        </Link>
    }


    return <>
        <DataGrid
            columns={gridColumns}
            rows={rows}
            loading={loading}
            showToolbar

            disableRowSelectionOnClick

            slots={{
                toolbar: Toolbar as never,
                row: LinkRow
            }}
        />

        <DeleteModal
            isOpen={deleteModalIsOpen}
            setIsOpen={setDeleteModalIsOpen}
            deleteFunction={deleteFunc}
            deleteDetails={currentDeleteModel}
            postDeleteCallback={handleSuccessfulDelete}
            slotComponent={currentDeleteModel?.additionalDetailsComponent}
            maxWidth="sm"
        />
    </>
}
