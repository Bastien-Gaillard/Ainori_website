import { CssBaseline, Box, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function Messages() {

    return (
            <Container component="main" maxWidth="xs">
                <p>In messages</p>
            </Container>

    );
}