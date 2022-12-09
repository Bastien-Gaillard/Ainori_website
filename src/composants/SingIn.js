import React from 'react';
import axios from 'axios';
import { useState } from "react";
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import  { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'; 
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// by Thomas Barron 09/12/2022 

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



const theme = createTheme();


export default function SignIn() {
  
  let navigate = useNavigate();
  const cookieLoginUser = 'login';
  const [users, setUsers] = useState();
  const [info, setInfo] = useState();

  //-- debug déconnexion--
  // onSubmit={déconnexion}
  /*
  const déconnexion = e => {
    e.preventDefault()
    delete_cookie(cookieLoginUser)
  }
  */
  //-- debug déconnexion--


  
  if(read_cookie(cookieLoginUser).length ==0){//if user is already connected
    console.log('Pas connecté')//-- debug --
  }else{
    //navigate('/');
    //add new page home
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      //-- debug --
      email: data.get('email'),
      password: data.get('password'),
    });
    async function fetchData() {
      if(data.get('email')=="" || data.get('password')==""){//if field (email,password) is empty 
        setInfo(<Alert severity="warning">Il faut remplir les champs 'Login' et 'Mot de passe'.</Alert>);
      }else{
        const userData = await axios.get('/api/get/loginUserSecure/'+data.get('email')+'/'+data.get('password'));
        setUsers(userData.data);
        console.log('data '+userData.data.length);
        if (userData.data.length ==1){//if a user is found => Login
          setInfo(<Alert severity="success">Login OK </Alert>);
          bake_cookie(cookieLoginUser, userData.data);//set value in 'cookieLoginUser'
          console.log(read_cookie(cookieLoginUser))//-- debug --
          //navigate('/');
          //add new page home
        }else{
          setInfo(<Alert severity="error">Pas le bon 'Login' ou 'Mot de passe' ressayé.</Alert>);
        }
      }
    }
    fetchData();

    
  };

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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            
            {info}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}