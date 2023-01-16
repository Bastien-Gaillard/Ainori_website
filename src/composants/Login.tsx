import axios from 'axios';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import theme from '../cusotmization/palette';

import { ThemeProvider } from '@mui/material/styles';
import { useForm } from "react-hook-form";
import { Container, Typography, Box, CssBaseline, Grid, Link } from '@mui/material';
import FormLogin from './form/FormLogin';
interface JSXElement extends React.ReactElement<any> { }
type Element = JSXElement | null;

//Create axios instance
const instance = axios.create({
  baseURL: 'http://localhost:3001/api/',
});

export default function Login() {

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Typography component="h1" variant="h5">
          Connexion
        </Typography>
        <FormLogin />
        <Grid container>
          <Grid item xs>
            <Link href="/forgot" variant="body2">
              Mot de passe oublié ?
            </Link>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
