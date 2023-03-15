import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { AlertColor, Box } from "@mui/material";
import Snackbar from "../../features/Snackbar";
import DeleteIcon from '@mui/icons-material/Delete';

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function DeleteRoutes({ routeId }) {

    console.log(routeId);
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState("Une erreur est survenu");
    const [severity, setSeverity] = useState<AlertColor>("error");
    const [notSame, setNotSame] = useState<boolean>(false);

    const handleClose = () => {
        setNotSame(false);
    };

    const deleteRoutes = async () => {
        try {
            if (window.confirm('⚠️ Voulez vous supprimer ce trajet ? ⚠️\n Un message sera envoyé aux participants')) {
                await instance.post('userHasRoute/route/', {route_id: routeId}, { headers: { "content-type": "application/json" } })
                    .then(async (response) => {
                        console.log('response', response.data);
                    }).catch((err) => {
                        //         setMessage("Une erreur est survenue");
                        //         setSeverity("error");
                        //         setOpen(true);
                        //         console.error(err);
                        //     });
                        // await instance.delete('route/delete/' + routeId)
                        //     .then(async (response) => {
                        //         setMessage("Trajet supprimé");
                        //         setSeverity("success");
                        //         setOpen(true);
                        //     }).catch((err) => {
                        //         setMessage("Une erreur est survenue");
                        //         setSeverity("error");
                        //         setOpen(true);
                        //         console.error(err);
                        //     });
                    });
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Box>
            <Button><DeleteIcon onClick={deleteRoutes} /></Button>
            <Snackbar severity={severity} message={message} open={open} handleClose={handleClose} />
        </Box>

    )

}


