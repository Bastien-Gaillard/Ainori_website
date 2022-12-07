import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import axios from "axios";
import { useEffect,useState } from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
export default function Profil() {
    return (
        <div>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    disabled
                    id="FirstName"
                    label="First name"
                    defaultValue="test lili"
                    variant="standard"
                />
                <TextField
                    disabled
                    id="LastName"
                    label="Last name"
                    defaultValue="test lili lasrt name"
                    variant="standard"
                />
                <TextField
                    disabled
                    id="Mail"
                    label="EMail"
                    defaultValue="test mail"
                    variant="standard"
                />
                <TextField
                    disabled
                    id="Description"
                    label="Description"
                    defaultValue="test desc"
                    variant="standard"
                />
            </Box>
            <Button variant="contained">Contained</Button>
      </div>
    );
}