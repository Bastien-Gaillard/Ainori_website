import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import theme from '../cusotmization/palette';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://localhost:3001/api/',
});

export default function Home() {

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        Bienvenue
      </Container>
    </ThemeProvider>
  );
}