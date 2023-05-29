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


export default function Nav({ value, role }) {
    const [pages, setPages] = useState(role != 1 ? [{ name: 'Les trajets', navigation: 'allRoutes' }, { name: 'Historique', navigation: 'History' }] : [{ name: 'Covoiturage', navigation: 'carpool' }, { name: 'Mes trajets', navigation: 'myroutes' }])

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [actif, setActif] = useState(value);
    const [cookies] = useCookies();
    const navigate = useNavigate()
    const cookieUser = cookies.user;
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    useEffect(() => {
        console.log('the value is ', value);
        setActif(value);
    }, [value])
    const NotLogin = (
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>
    )
    const Login = (
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'end' }}>
            {pages.map((page) => (
                <Button
                    variant='text'
                    key={page.name}
                    onClick={() => { setActif(page.navigation); navigate(page.navigation) }}
                    sx={{
                        my: 2, color: actif == page.navigation ? '#f3c72a' : '#ffffff', display: 'block', '&:hover': {
                            color: '#ffc107',
                        }
                    }}
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