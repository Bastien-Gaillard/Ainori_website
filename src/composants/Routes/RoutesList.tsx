import * as React from 'react';
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, ButtonGroup } from '@mui/material';
import Historical from './Historical/Historical';
import Comming from './Comming/Comming';
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});
const RoutesList = () => {

    const [showComponent, setShowComponent] = useState("profil")
    const buttons = [
        <Button key="profil" onClick={() => setShowComponent("profil")}>Mes trajets</Button>,
        <Button key="avis" onClick={() => setShowComponent("comming")}>Trajets à venir</Button>,
        <Button key="vehiclues" onClick={() => setShowComponent("historical")}>Historique</Button>,
    ];
    return (
        <div>
            <Box sx={{display: 'flex'}}>
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
                    ? <Historical /> : <p>"prodil"</p>}
        </div>
    )
};

export default RoutesList;