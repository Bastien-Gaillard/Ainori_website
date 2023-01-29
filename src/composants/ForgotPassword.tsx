import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import theme from '../cusotmization/palette'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormForgotPassword from './Form/FormForgotPassword';
import { AlertColor } from '@mui/material';
import Index from './404/Index';
const instance = axios.create({
    baseURL: 'http://localhost:3001/api/',
});

export default function ForgotPassword() {

    const [exist, setExist] = useState(true);

    let navigate = useNavigate();

    const validateLink = async () => {
        const data = new FormData();
        data.append('link', window.location.pathname);
        await instance.post('valide/link', data, { headers: { "content-type": "application/json" } })
            .then((response) => {
                if (!response.data) {
                    setExist(false);
                }
            }).catch((err) => {
                console.error(err);
            });
    }
    useEffect(() => {
        validateLink();
    }, []);

    return (
        <>
            {!exist ? <Index /> :
                <Container component="main" maxWidth="xs">
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
                        <FormForgotPassword />
                    </Box>
                </Container>
            }
        </>
    );
}