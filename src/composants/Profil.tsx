import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";
import CreateIcon from '@mui/icons-material/Create';
import { InputAdornment } from "@mui/material";
import FormProfil from "./form/FormProfil";
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

type UserModel = {
    firstname: string,
    lastname: string,
    email: string,
    description?: string
}
export default function Profil() {
    const [user, setUser] = useState<UserModel>(null);
    const [modify, setModify] = useState<boolean>(false);
    const [disableFirstname, setDisableFirstname] = useState<boolean>(true);


    useEffect(() => {
        (async () => {
            await getUser();
        })();
    }, []);

    useEffect(() => {
        console.log('second use effect', user)
    }, [user]);

    const updateUser = (updatedUser: UserModel) => {
        setUser(updatedUser);
        console.log('userUpdate');
    };

    const getUser = async () => {
        await instance.get('user/current/id')
            .then((response) => {
                if (response.data) {
                    console.log('the response', response.data);
                    setUser(response.data);
                }
            }).catch((err) => {
                console.error(err);
            });
    }

    if (user !== null) {

        return (
            <FormProfil user={user}  updateUser={updateUser}/>
        );
    } else {

        return (
            <h2>Aucne information</h2>
        )
    }

}



