import axios from 'axios';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import theme from '../cusotmization/palette';

import { useForm } from "react-hook-form";
import { Container, Typography, Box, CssBaseline, Grid, Link } from '@mui/material';
import FormLogin from './Form/FormLogin';
interface JSXElement extends React.ReactElement<any> { }
type Element = JSXElement | null;

//Create axios instance
const instance = axios.create({
  baseURL: 'http://localhost:3001/',
});

export default function Login() {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5">
        Connexion
      </Typography>
      <FormLogin />
      <Grid container>
        <Grid item xs>
          <Link href="/forgot">
            Mot de passe oublié ?
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}
