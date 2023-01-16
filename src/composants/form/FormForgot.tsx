import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, Button, Link, Box, Snackbar } from "@mui/material";
import { Controller, useForm, ValidationRule } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import emailjs from '@emailjs/browser';
import Alert from "../features/Alert";
const instance = axios.create({
    baseURL: 'http://localhost:3001/api/',
});


export default function FormForgot() {
    const { handleSubmit, formState: { errors }, register } = useForm();
    const [open, setOpen] = useState<boolean>(false);


    const onSubmit = async (data) => {
        await instance.post('forgot', data, { headers: { "content-type": "application/json" } })
            .then((response) => {
                if (response.data != false) {
                    emailjs.send("service_10k2k67", "template_597yze8", response.data, 'HamLJtCxqPRaXk6xn');
                }
                setOpen(true);
            }).catch((err) => {
                console.error(err);
            });
    }
    const handleClose = (reason) => {
        console.log("close");
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
                type="text"
                name="email"
                margin="normal"
                fullWidth
                label="Adresse mail"
                error={!!errors.email}
                helperText={errors.email && "L'adresse mail est invalide"}
                InputProps={{
                    ...register("email",
                        {
                            required: true,
                            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
                        })
                }}
            />
            <Alert severity="info" open={open} message="Si le compte existe, un mail vous a était envoyé" handleClose={handleClose}/>
            <Button
                color="secondary"
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Valider
            </Button>
            <Link href="/login" variant="body2">
                Se connecter
            </Link>
        </Box>
    );
}