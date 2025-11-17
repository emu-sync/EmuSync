import { TextField, TextFieldProps } from "@mui/material";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

type DefaultTextFieldProps = TextFieldProps & {
    field: ControllerRenderProps<any, any>;
    fieldState?: ControllerFieldState;
};

export default function DefaultTextField({
    field,
    fieldState,
    ...props
}: DefaultTextFieldProps) {
    return <TextField
        {...field}
        error={!!fieldState?.error}
        helperText={fieldState?.error?.message}
        variant="outlined"
        fullWidth
        slotProps={{
            inputLabel: {
                shrink: true,
            },
        }}
        {...props}
    />
}
