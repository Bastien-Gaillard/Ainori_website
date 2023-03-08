import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import CreateIcon from '@mui/icons-material/Create';
import { ButtonGroup, InputAdornment } from "@mui/material";
import FormProfil from "../form/FormProfil";
import Cars from "./Cars";
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

type UserModel = {
    firstname: string,
    lastname: string,
    email: string,
    description?: string
}



export default function Profil({ obtion }) {
    const [user, setUser] = useState<UserModel>(null);
    const [modify, setModify] = useState<boolean>(false);
    const [disableFirstname, setDisableFirstname] = useState<boolean>(true);
    const [showBox, setShowBox] = useState(obtion);

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
                    <ButtonGroup
                        sx={{
                            width: '12vw', marginLeft: '2vw', marginTop: '2vh'
                        }}
                        orientation="vertical"
                        aria-label="vertical outlined button group"
                    >
                        {buttons}
                    </ButtonGroup>
                    <Box sx={{ width: '68vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {showBox == "profil" ? <FormProfil user={user} updateUser={updateUser} /> : showBox == "vehiclues" ? <Cars /> : <p>Ahhhhhh</p>}
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



