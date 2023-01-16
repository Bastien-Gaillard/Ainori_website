import { Alert, AlertColor, Snackbar } from "@mui/material";
import axios from "axios";

export default ({
    severity,
    open,
    message,
    handleClose
}: {
    severity: AlertColor,
    open: boolean,
    message: string,
    handleClose: any
}) => {


    return (
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}