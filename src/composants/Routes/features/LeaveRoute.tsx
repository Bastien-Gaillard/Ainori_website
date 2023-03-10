import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { AlertColor, Box } from "@mui/material";
import Snackbar from "../../features/Snackbar";
import LogoutIcon from '@mui/icons-material/Logout';

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function LeaveRoute({ routeId, userHasRouteId, remainingSeats }) {

    console.log(routeId, remainingSeats);
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState("Une erreur est survenu");
    const [severity, setSeverity] = useState<AlertColor>("error");
    const [notSame, setNotSame] = useState<boolean>(false);

    const handleClose = () => {
        setNotSame(false);
    };

    const leaveRoutes = async () => {
        try {
            if (window.confirm('⚠️ Voulez vous quitter ce trajet ? ⚠️\n Un message sera envoyé au conducteur')) {
                await instance.delete('userHasRoute/delete/' + userHasRouteId)
                    .then(async (response) => {
                        await instance.put('route/remainingSeats', { id: routeId, remaining_seats: remainingSeats + 1 }, { headers: { "content-type": "application/json" } })
                            .then(async (response) => {
                                setMessage("Desinscription validée");
                                setSeverity("success");
                                setOpen(true);
                            }).catch((err) => {
                                console.error(err);
                            });
                    }).catch((err) => {
                        console.error(err);
                    });

            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Box>
            <Button><LogoutIcon onClick={leaveRoutes} /></Button>
            <Snackbar severity={severity} message={message} open={open} handleClose={handleClose} />
        </Box>

    )

}


