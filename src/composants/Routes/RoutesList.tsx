import * as React from 'react';
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, ButtonGroup, Dialog, DialogContent, DialogTitle } from '@mui/material';
import Historical from './Historical/Historical';
import Comming from './Comming/Comming';
import FormTrajets from '../form/FormTrajets';
import CloseIcon from '@mui/icons-material/Close';
import CommingDriver from './Comming/CommingDriver';

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});
const RoutesList = ({ socket }) => {

    const [showComponent, setShowComponent] = useState("commingDriver");
    const [openAdd, setOpenAdd] = useState(false);
    const [colorComming, setColorComming] = useState('black');
    const [colorCommingDriver, setColorCommingDriver] = useState('#ffc107');
    const [colorvehiclues, setColorVehiclues] = useState('black');

    const [colorCreate, setColorCreate] = useState('black');


    const handleClickOpenAdd = () => {
        setOpenAdd(true);
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
    };


    const buttons = [


    ];
    return (
        <Box sx={{ display: 'flex', width: '100%', minHeight: 'calc(100vh - 60px)' }}>
            <Box sx={{ display: 'flex', width: '10%', flexDirection: 'column', backgroundColor: '#B2EBF2' }}>
                <Button sx={{
                    color: colorCommingDriver,
                    margin: '1vh 0 1vh 0',
                    '&:hover': {
                        color: '',
                    },
                }} key="comming" onClick={() => {
                    setShowComponent("commingDriver");
                    setColorComming('black');
                    setColorCommingDriver('#ffc107')
                    setColorVehiclues('black');
                    setColorCreate('black')
                }}>Je conduis</Button>
                <Button sx={{
                    color: colorComming,
                    margin: '1vh 0 1vh 0',
                    '&:hover': {
                        color: '#ffc107',
                    },
                }} key="vehiclues" onClick={() => {
                    setShowComponent("comming")
                    setColorComming('#ffc107');
                    setColorCommingDriver('black');
                    setColorVehiclues('black');
                    setColorCreate('black')
                }}
                >Je suis passagé</Button>
                <Button sx={{
                    color: colorvehiclues,
                    margin: '1vh 0 1vh 0',
                    '&:hover': {
                        color: '#ffc107',
                    },
                }} key="vehiclues" onClick={() => {
                    setShowComponent("historical")
                    setColorComming('black');
                    setColorVehiclues('#ffc107');
                    setColorCommingDriver('black')
                    setColorCreate('black')
                }}
                >Historique</Button>
                <Button sx={{
                    color: 'black',
                    margin: '1vh 0 1vh 0',
                    '&:hover': {
                        color: '#ffc107',
                    },
                }} key="vehiclues" onClick={() => {
                    setColorComming('black');
                    setColorVehiclues('black');
                    setColorCreate('#ffc107')
                    handleClickOpenAdd();
                }}>Créer un trajet</Button>
            </Box>
            {
                showComponent == "commingDriver"
                    ? <CommingDriver socket={socket} />
                    : showComponent == "comming"
                    ? <Comming socket={socket}/>
                    : showComponent == "historical" && <Historical />

            }

            <Dialog
                open={openAdd}
                onClose={handleCloseAdd}
                sx={{ width: '100%' }}
            >
                <DialogTitle>
                    <CloseIcon onClick={handleCloseAdd} sx={{ color: 'red' }} />
                </DialogTitle>
                <DialogContent>
                    <FormTrajets handleCloseForm={handleCloseAdd} />
                </DialogContent>
            </Dialog>
        </ Box >
    )
};

export default RoutesList;