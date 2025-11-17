import { Pre } from "@/renderer/components/Pre";
import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { Breakpoint, Button, CircularProgress, Divider, TextField, Typography } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect, useRef, useState } from "react";

export interface DeleteModalProps {
    deleteDetails: DeleteItemDetails | null;
    isOpen: boolean;
    maxWidth?: Breakpoint;
    slotComponent?: React.ReactNode;
    isLoading?: boolean;
    setIsOpen: (isOpen: boolean) => void;
    deleteFunction: (id: string) => Promise<any>;
    postDeleteCallback?: (deleteDetails: DeleteItemDetails) => void;
}

export interface DeleteItemDetails {
    id: string;
    nameIdentifier: string;
    preventDelete?: boolean;
    preventDeleteReason?: string;
    additionalDetailsComponent?: React.ReactNode;
}

export default function DeleteModal({
    deleteDetails, isOpen, maxWidth, slotComponent, isLoading,
    setIsOpen, deleteFunction, postDeleteCallback
}: DeleteModalProps) {

    const loading = typeof isLoading !== "undefined" ? isLoading : false;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClose = () => {
        setIsOpen(false);
        setConfirmText("");
    };

    const preventDelete = deleteDetails?.preventDelete || false;
    const deleteIsAllowed = confirmText.toLowerCase() === "confirm";

    useEffect(() => {
        if (!isOpen) {
            setConfirmText("");
        }
    }, [isOpen]);

    useEffect(() => {

        if (!loading && isOpen && inputRef.current !== null) {

            setTimeout(() => {
                if (inputRef.current !== null) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    }, [isOpen, inputRef, loading]);

    return <Dialog
        keepMounted
        disableEnforceFocus
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
            elevation: 3,
            component: 'form',
            onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();

                if (!deleteIsAllowed) return;
                if (deleteDetails === null) return;

                setIsSubmitting(true);

                try {

                    await deleteFunction(deleteDetails.id);

                    if (postDeleteCallback) {
                        postDeleteCallback(deleteDetails);
                    }

                } catch (ex) {
                    console.error(ex);
                } finally {
                    setIsSubmitting(false);
                }
            }
        }}

        maxWidth={maxWidth}
        fullWidth
    >
        <DialogTitle
            variant="h6"
        >
            Delete item
        </DialogTitle>
        <Divider variant="middle" />
        <DialogContent>
            {
                loading ?
                    <Typography>
                        Loading information... <CircularProgress size={16} />
                    </Typography>
                    :
                    preventDelete ?
                        <Typography>
                            {deleteDetails?.preventDeleteReason}
                        </Typography>
                        :
                        <VerticalStack>
                            <VerticalStack justifyContent="start">
                                <Typography>
                                    You are about to <strong>permanently</strong> delete the following item: <Pre>{deleteDetails?.nameIdentifier}</Pre>.
                                </Typography>
                            </VerticalStack>

                            {slotComponent}

                            <Typography>
                                Type the word <Pre>confirm</Pre> to proceed with the delete.
                            </Typography>

                            <TextField
                                inputRef={inputRef}
                                onChange={(e) => setConfirmText(e.target.value)}
                                value={confirmText}
                                disabled={isSubmitting}
                                variant="outlined"
                            />
                        </VerticalStack>
            }

        </DialogContent>
        <Divider variant="middle" />
        <VerticalStack sx={{ p: 3 }}>

            {
                !preventDelete &&
                <Button
                    disabled={!deleteIsAllowed || isSubmitting || loading}
                    loading={isSubmitting} type="submit"
                    color="error"
                    variant="contained"
                >
                    Delete
                </Button>
            }

            <Button
                onClick={handleClose}
                disabled={isSubmitting || loading}
                color="secondary"
                variant="contained"
            >
                Cancel
            </Button>

        </VerticalStack>
    </Dialog>
}
