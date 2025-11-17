import VerticalStack from "@/renderer/components/stacks/VerticalStack";
import { Breakpoint, Button, Divider } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from "react";

interface ShowModalProps {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    maxWidth?: Breakpoint;
    paperElevation?: number;
    showCloseButton?: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onClose?: () => void;
}

export default function ShowModal({
    isOpen, title, children, maxWidth, paperElevation, showCloseButton,
    setIsOpen, onClose
}: ShowModalProps) {

    const handleClose = () => {

        setIsOpen(false);

        if (typeof onClose !== "undefined") {
            onClose();
        }

    }

    const showClose = showCloseButton ?? false;

    return <Dialog
        keepMounted
        disableEnforceFocus
        open={isOpen}
        onClose={handleClose}

        maxWidth={maxWidth}
        fullWidth

        PaperProps={{
            elevation: paperElevation ?? 3
        }}
    >
        <DialogTitle>
            {title}
        </DialogTitle>
        <Divider variant="middle" />
        <DialogContent>
            {children}
        </DialogContent>
        {
            showClose && <>
                <Divider variant="middle" />
                <VerticalStack
                    sx={{ p: 3 }}
                    alignItems="center"
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                        sx={{
                            width: {
                                xs: "100%",
                                sm: 300
                            }
                        }}
                    >
                        Close
                    </Button>
                </VerticalStack>
            </>
        }
    </Dialog>
}
