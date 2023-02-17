import { Container, Snackbar, Alert, Button, Box } from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, Theme } from '@mui/material/styles';
import { bgcolor, palette } from '@mui/system';

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function Index() {

    return (
        <Box >
            <h1>Cette page n'existe pas</h1>
            <Button href='/home'>Revenir à la page d'acceuil</Button>
        </Box>
    );
}