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

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});
const RoutesList = () => {

    const [showComponent, setShowComponent] = useState("comming");
    const [openAdd, setOpenAdd] = useState(false);

    const handleClickOpenAdd = () => {
        setOpenAdd(true);
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
    };


    const buttons = [
        <Button key="avis" onClick={() => setShowComponent("comming")}>Trajets à venir</Button>,
        <Button key="vehiclues" onClick={() => setShowComponent("historical")}>Historique</Button>,
        <Button key="vehiclues" onClick={handleClickOpenAdd}>Créer trajet</Button>,

    ];
    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <ButtonGroup
                    sx={{
                        width: '12vw', marginLeft: '2vw', marginTop: '2vh'
                    }}
                    orientation="vertical"
                    aria-label="vertical outlined button group"
                >
                    {buttons}
                </ButtonGroup>
                <h1>Les trajets</h1>
            </Box>
            {showComponent == "comming"
                ? <Comming />
                : showComponent == "historical"
                && <Historical />}

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
        </div>
    )
};

export default RoutesList;