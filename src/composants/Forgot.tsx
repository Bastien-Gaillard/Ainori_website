import { CssBaseline, Box, Typography, Container } from '@mui/material';
import axios from 'axios';
import theme from '../cusotmization/palette'
import { useState } from 'react';
import FormForgot from './form/FormForgot';
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function Forgot() {

    return (
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

    );
}