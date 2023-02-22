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
import { useForm } from 'react-hook-form';
import FormCars from './form/FormCars';
const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default function AddCars() {


    return (
        <>
            <FormCars />
        </>
    );
}