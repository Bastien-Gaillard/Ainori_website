import axios from 'axios';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import theme from '../cusotmization/palette';
import { makeStyles } from '@mui/styles';
import { useForm } from "react-hook-form";
import { Container, Typography, Box, CssBaseline, Grid, Link } from '@mui/material';
import FormLogin from './Form/FormLogin';
interface JSXElement extends React.ReactElement<any> { }
type Element = JSXElement | null;

//Create axios instance
const instance = axios.create({
  baseURL: 'http://localhost:3001/',
});

const useStyles = makeStyles({
  title: {
    fontFamily: 'Anton',
    fontWeight: 'bold',
    textAlign: 'center'
  },
});
export default function Login() {
  const classes = useStyles();
  return (
    <Container component="main" sx={{
      height: 'calc(100vh - 60px)', width: '28vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '20vh', minHeight: '420px', minWidth: '258px'
      , '@media (max-width: 1080px)': {
        width: '42vw',
      },
      '@media (max-width: 680px)': {
        width: '64vw',
      },
      '@media (max-width: 606px)': {
        width: '72vw',
      },
    }} >
      <CssBaseline />
      <h1 className={classes.title}>
        Connexion
      </h1>
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
