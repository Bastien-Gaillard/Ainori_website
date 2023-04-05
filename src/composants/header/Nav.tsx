import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import theme from '../../cusotmization/palette';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

const pages = [{name: 'Covoiturage', navigation: 'carpool'}, {name: 'Mes trajets', navigation: 'myroutes'}];

export default function Nav() {


    const [anchorElNav, setAnchorElNav] = useState(null);
    const [cookies] = useCookies();
    const navigate = useNavigate()
    const cookieUser = cookies.user;
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    
    const NotLogin = (
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>
    )
    const Login = (
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'end' }}>
            {pages.map((page) => (
                <Button
                    variant='text'
                    key={page.name}
                    onClick={() => navigate(page.navigation)}
                    sx={{ my: 2, color: 'white', display: 'block', '&:hover': {
                        color: '#ffc107',
                      } }}
                >
                    {page.name}
                </Button>
            ))}
        </Box>
    )
    return (
        cookieUser ? Login : NotLogin
    );
}