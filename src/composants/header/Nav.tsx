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
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../cusotmization/palette';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3001/api/',
});

const pages = ['Products', 'Pricing', 'Blog'];

export default ({
    isConnected,
}: {
    isConnected: Boolean,
}) => {

    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const NotLogin = (
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>
    )
    const Login = (
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
                <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    {page}
                </Button>
            ))}
        </Box>
    )

    return (
        isConnected ? Login : NotLogin
    );
}