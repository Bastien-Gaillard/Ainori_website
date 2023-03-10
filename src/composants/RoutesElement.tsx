import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { AlertColor, Box } from "@mui/material";
import Snackbar from "./features/Snackbar";
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function Profil() {

    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState("Une erreur est survenu");
    const [severity, setSeverity] = useState<AlertColor>("error");
    const [notSame, setNotSame] = useState<boolean>(false);
    const [userRouteId, setUserRouteId] = useState<number>(null);

    const handleClose = () => {
        setNotSame(false);
    };


    const joinRoutes = async () => {
        const routeId = 2;
        try {
            await instance.post('userHasRoute/user/route', { route_id: routeId }, { headers: { "content-type": "application/json" } })
                .then(async (response) => {
                    if (response.data[0]) {
                        setMessage("Vous êtes déja inscrit au trajet");
                        setSeverity("info");
                        setOpen(true);
                    } else {
                        await instance.post('route', { id: routeId }, { headers: { "content-type": "application/json" } })
                            .then(async (response) => {
                                const remainingSeats = response.data.remaining_seats;
                                if (remainingSeats == 0) {
                                    setMessage("Le trajet n'a plus de place disponible");
                                    setSeverity("error");
                                    setOpen(true);
                                    return;
                                } else {
                                    await instance.post('userHasRoute/create', { route_id: routeId, status_notice: 0 }, { headers: { "content-type": "application/json" } })
                                        .then(async (response) => {
                                            await instance.put('route/remainingSeats', { id: routeId, remaining_seats: remainingSeats - 1 }, { headers: { "content-type": "application/json" } })
                                                .then(async (response) => {
                                                    setMessage("Inscription validée");
                                                    setSeverity("success");
                                                    setOpen(true);
                                                }).catch((err) => {
                                                    console.error(err);
                                                });
                                        }).catch((err) => {
                                            console.error(err);
                                        });
                                }
                            }).catch((err) => {
                                console.error(err);
                            });
                    }
                }).catch((err) => {
                    console.error(err);
                });

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Box>
            <Button><AddIcon onClick={joinRoutes} /></Button>
            <Snackbar severity={severity} message={message} open={open} handleClose={handleClose} />
        </Box>

    )

}


