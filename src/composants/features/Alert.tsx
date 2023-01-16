import { Alert, AlertColor } from "@mui/material";
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
        <>
            {open &&
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            }
        </>

    );
}