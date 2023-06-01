import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { AlertColor, Box } from "@mui/material";
import Snackbar from "../../features/Snackbar";
import DeleteIcon from '@mui/icons-material/Delete';
import * as moment from 'moment';
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function DeleteRoutes({ routeId, onDeleteRoutesValue, socket }) {

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
                await instance.post('userHasRoute/route', { route_id: routeId }, { headers: { "content-type": "application/json" } })
                    .then(async (response) => {
                        console.log(response.data);
                        await instance.post('views/routeInfo', { route_id: routeId }, { headers: { "content-type": "application/json" } })
                            .then(async (route) => {
                                console.log(route.data);
                                if (!!response.data) {
                                    response.data.forEach(async (element) => {
                                        socket.emit('message', {
                                            text: 'Le trajet du ' + moment(route.data[0].departure_date).locale("fr").format('LL') + ' allant de ' + route.data[0].departure_city + ' à ' + route.data[0].arrival_city + ' a était supprimer par le conducteur',
                                            name: localStorage.getItem('userName'),
                                            received: element.user_id,
                                            id: `${socket.id}${Math.random()}`,
                                            socketID: socket.id,
                                        });
                                        await instance.post('messages/create', { content: 'Le trajet du ' + moment(route.data[0].departure_date).locale("fr").format('LL') + ' allant de ' + route.data[0].departure_city + ' à ' + route.data[0].arrival_city + ' a était supprimer par le conducteur', received_by_user_id: element.user_id }, { headers: { "content-type": "application/json" } });
                                        await instance.delete('userHasRoute/delete/' + element.id, { headers: { "content-type": "application/json" } });
                                    });
                                }
                                await instance.delete('route/delete/' + routeId);
                                onDeleteRoutesValue(Date.now());
                            }).catch((err) => {


                            });
                    }).catch((err) => {
                        console.log(err);
                    });
            }
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <Box>
            <Button><DeleteIcon onClick={deleteRoutes} sx={{color: '#f3c72a'}}/></Button>
        </Box>

    )

}


