import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import theme from '../cusotmization/palette';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';
import { Box, Button } from '@mui/material';
const instance = axios.create({
  baseURL: 'http://localhost:3001/',
});

export default function Home() {
  return (
    <Box>
      Bienvenue
    </Box>
  );
}