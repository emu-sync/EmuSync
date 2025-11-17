import { useSnackbar } from "notistack";

//custom hook to make alerts easier
export default function useAlerts() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const functionExports = {
        errorAlert: (msg: string) => {
            enqueueSnackbar(msg, { variant: "error" });
        },
        successAlert: (msg: string) => {
            enqueueSnackbar(msg, { variant: "success" });
        },
        warningAlert: (msg: string) => {
            enqueueSnackbar(msg, { variant: "warning" });
        },
        infoAlert: (msg: string) => {
            enqueueSnackbar(msg, { variant: "info" });
        },
    }

    return functionExports;
}