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
import * as moment from 'moment';

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function LeaveRoute({ onDeleteRoutesValue, routeId, userHasRouteId, userId, socket }) {

    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState("Une erreur est survenu");
    const [severity, setSeverity] = useState<AlertColor>("error");
    const [notSame, setNotSame] = useState<boolean>(false);

    const handleClose = () => {
        setNotSame(false);
    };

    const leaveRoutes = async () => {
        if (window.confirm('⚠️ Voulez vous quitter ce trajet ? ⚠️\n Un message sera envoyé au conducteur')) {
            console.log('in');

            await instance.delete('userHasRoute/delete/' + userHasRouteId, { headers: { "content-type": "application/json" } });
            const route = await instance.post('views/routeInfo', { route_id: routeId }, { headers: { "content-type": "application/json" } })
            socket.emit('message', {
                text: 'Viens de quitter le trajet du ' + moment(route.data[0].departure_date).locale("fr").format('LL') + ' allant de ' + route.data[0].departure_city + ' à ' + route.data[0].arrival_city,
                name: localStorage.getItem('userName'),
                received: userId,
                id: `${socket.id}${Math.random()}`,
                socketID: socket.id,
            });
            await instance.post('messages/create', { content: 'Viens de quitter le trajet du ' + moment(route.data[0].departure_date).locale("fr").format('LL') + ' allant de ' + route.data[0].departure_city + ' à ' + route.data[0].arrival_city, received_by_user_id: route.data[0].user_id }, { headers: { "content-type": "application/json" } });
            onDeleteRoutesValue(Date.now());
        }
    }

    return (
        <Box>
            <Button><LogoutIcon onClick={leaveRoutes} sx={{color: '#f3c72a'}}/></Button>
            <Snackbar severity={severity} message={message} open={open} handleClose={handleClose} />
        </Box>

    )
}


