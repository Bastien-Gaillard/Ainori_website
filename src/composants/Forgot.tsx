import { CssBaseline, Box, Typography, Container } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import theme from '../cusotmization/palette'
import { useState } from 'react';
import FormForgot from './form/FormForgot';
const instance = axios.create({
    baseURL: 'http://localhost:3001/api/',
});

export default function Forgot() {

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
                    <FormForgot />
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