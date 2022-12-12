import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import theme from '../cusotmization/palette';
import { ThemeProvider } from '@mui/material/styles';
import  { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useEffect } from "react";
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

// by Thomas Barron 10/12/2022 


export default function Home() {
    const cookieLoginUser = 'login';
    let navigate = useNavigate();
    useEffect(() => {
        if(read_cookie(cookieLoginUser).length ==0){//if user is not connected => signin
            navigate('/signin');
        }
    }, []);


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
          <Typography component="h1" variant="h5">
            Home
          </Typography>
      </Container>
    </ThemeProvider>
  );
}