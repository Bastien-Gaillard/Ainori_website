import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import emailjs from '@emailjs/browser';
import Link from '@mui/material/Link';

import { useState } from 'react';
const theme = createTheme();

export default function Forgot() {

    const [open, setOpen] = useState(false);
    const [validate, setValidate] = useState(0);

    const checkPassword = async (email, firstPassword, secondPassword) => {
        const result = await axios.get('/api/get/userByEmail/' + email);
        if (result.data != "") {

        }
    }
    const sendMail = async (email) => {
        const result = await axios.get('/api/get/userByEmail/' + email);
        if (result.data != "") {
            emailjs.send("service_10k2k67", "template_597yze8", {
                user_name: "bastien",
                link: "dlposq",
                email: email,
            }, 'HamLJtCxqPRaXk6xn');
            setValidate(0);
        } else {
            setValidate(1);
        }
        handleClick();
    }
    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        if (email === "") {
            setValidate(3);
        } else {
            sendMail(data.get('email'));
        }




    };
    const validateNotif = (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                Un mail vous a était envoyé
            </Alert>
        </Snackbar>
    )
    const errorNotif = (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                L'adresse mail n'existe pas
            </Alert>
        </Snackbar>
    )
    const missNotif = (
        <Alert severity="warning" sx={{ width: '100%' }}>
            Un champ est vide
        </Alert>
    )
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Mot de passe oublié
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Adresse mail"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        {validate == 0 ? validateNotif : validate == 1 ? errorNotif : missNotif}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Valider
                        </Button>
                        <Link href="/signin" variant="body2">
                            Se connecter
                        </Link>
                    </Box>
                </Box>
            </Container>

        </ThemeProvider>

    );
}













// if (result.data != "") {
        //     console.log(firstPassword, secondPassword);
        //     if (firstPassword == secondPassword) {
        //         await axios.get('/api/update/password/' + result.data[0].id + '/' + newPassword);
        //         setValidate(0);
        //     } else {
        //         setError('Les mots de passe ne sont pas identhique')
        //         setValidate(1);
        //     }
        // } else {
        //     setError('L\'adresse mail est invalide')
        //     setValidate(1);
        // }
        // handleClick();

          // const newPassword = data.get('newPassword')
        // const confirmPassword = data.get('confirmPassword');
        // console.log({
        //     email: data.get('email'),
        //     newPassword: data.get('newPassword'),
        //     confirmPassword: data.get('confirmPassword'),
        // });
        // if (email === "" || newPassword === "" || confirmPassword === "") {