import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const instance = axios.create({
    baseURL: 'http://localhost:3001/api/',
});

type UserModel = {
    firstname: string,
    lastname: string,
    email: string, 
    description?: string
} 
export default function Profil() {
    const [user, setUser] = useState<UserModel>({ firstname: '', lastname: '', email: ''});

    useEffect(() => {
        (async () => {
            await getUser();
        })();
    }, []);

    // useEffect(() => {
    //     console.log('second use effect', firstname, lastname)
    // }, [user]);

    const getUser = async () => {
        await instance.get('user')
            .then((response) => {
                console.log('the response', response)
                if (response.data) {
                    setUser(response.data);
                
                }
            }).catch((err) => {
                console.error(err);
            });
    }
    return (
        <div>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    disabled
                    id="FirstName"
                    label="First name"
                    value={user.firstname}
                    
                    variant="standard"
                />
                <TextField
                    disabled
                    id="LastName"
                    label="Last name"
                    value={user.lastname}
                    variant="standard"
                />
                <TextField
                    disabled
                    id="Mail"
                    label="EMail"
                    value={user.email}
                    variant="standard"
                />
                <TextField
                    disabled
                    id="Description"
                    label="Description"
                    value={user.description || ''}
                    variant="standard"
                />
            </Box>
            <Button variant="contained">Contained</Button>
        </div>
    );
}



