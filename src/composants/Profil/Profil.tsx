import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Avis from './Avis';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import CreateIcon from '@mui/icons-material/Create';
import { ButtonGroup, InputAdornment } from "@mui/material";
import FormProfil from "../form/FormProfil";
import Cars from "./Cars";
import { Helmet } from 'react-helmet'
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

type UserModel = {
    firstname: string,
    lastname: string,
    email: string,
    description?: string
}



export default function Profil({ obtion, updateImage }) {
    const [user, setUser] = useState<UserModel>(null);
    const [modify, setModify] = useState<boolean>(false);
    const [disableFirstname, setDisableFirstname] = useState<boolean>(true);
    const [showBox, setShowBox] = useState("profil");
    const [colorProfil, setColorProfil] = useState('#ffc107');
    const [colorVehicles, setColorVehicles] = useState('black');
    const [colorNotices, setColorNotices] = useState('black');
    const [image, setImage] = useState(null);

    useEffect(() => {
        updateImage(image);
    }, [image]);

    useEffect(() => {
        setShowBox(obtion);
    }, [obtion]);

    useEffect(() => {
        (async () => {
            await getUser();
        })();
    }, []);

    const updateUser = (updatedUser: UserModel) => {
        setUser(updatedUser);
    };

    const getUser = async () => {
        await instance.get('user/current/id')
            .then((response) => {
                if (response.data) {
                    setUser(response.data);
                }
            }).catch((err) => {
                console.error(err);
            });
    }

    const buttons = [
        <Button key="profil" onClick={() => setShowBox("profil")}>Mon profil</Button>,
        <Button key="avis" onClick={() => setShowBox("avis")}>Mes avis</Button>,
        <Button key="vehiclues" onClick={() => setShowBox("vehiclues")}>Mes vehicules</Button>,
    ];

    if (user !== null) {
        return (
            <>
                <Box sx={{
                    minHeight: '93vh',
                    display: 'flex',
                    width: '100vw',
                }}
                    className='waw'>

                    <Helmet>
                        <title>Profil</title>
                    </Helmet>
                    <Box sx={{ display: 'flex', width: '10%', flexDirection: 'column', backgroundColor: '#B2EBF2' }}>
                        <Button sx={{
                            color: colorProfil,
                            margin: '1vh 0 1vh 0',
                            '&:hover': {
                                color: '',
                            },
                        }} key="profil" onClick={() => {
                            setShowBox("profil")
                            setColorProfil('#ffc107');
                            setColorVehicles('black');
                            setColorNotices('black')
                        }}>Mon profil</Button>
                        <Button sx={{
                            color: colorVehicles,
                            margin: '1vh 0 1vh 0',
                            '&:hover': {
                                color: '#ffc107',
                            },
                        }} key="vehiclues" onClick={() => {
                            setShowBox("avis")
                            setColorProfil('black');
                            setColorVehicles('#ffc107');
                            setColorNotices('black')
                        }}
                        >Mes avis</Button>
                        <Button sx={{
                            color: colorNotices,
                            margin: '1vh 0 1vh 0',
                            '&:hover': {
                                color: '#ffc107',
                            },
                        }} key="vehiclues" onClick={() => {
                            setShowBox("vehiclues")
                            setColorProfil('black');
                            setColorVehicles('black');
                            setColorNotices('#ffc107')
                        }}>Mes vehicules</Button>
                    </Box>
                    <Box sx={{ width: '68vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {showBox == "profil" ? <FormProfil user={user} updateUser={updateUser} updateImage={setImage} /> : showBox == "vehiclues" ? <Cars /> : <Avis />}
                    </Box>
                </Box>
            </>

        );
    } else {

        return (
            <h2>Aucne information</h2>
        )
    }

}



