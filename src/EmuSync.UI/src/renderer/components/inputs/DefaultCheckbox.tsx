import { Checkbox, FormControlLabel, CheckboxProps } from "@mui/material";
import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

type DefaultCheckboxProps = CheckboxProps & {
    field: ControllerRenderProps<any, any>;
    fieldState?: ControllerFieldState;
    label: string;
    disabled?: boolean;
};

export default function DefaultCheckbox({
    field,
    fieldState,
    label,
    disabled,
    ...props
}: DefaultCheckboxProps) {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    {...field}
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={disabled}
                    {...props}
                />
            }
            label={label}
        />
    );
}
