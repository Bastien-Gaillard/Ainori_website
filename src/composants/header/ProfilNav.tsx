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
import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../cusotmization/palette';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
const settings = [{
    name: "Profile",
    redirect: "/profil"
},
{
    name: "Messages",
    redirect: "/messages"
},
{
    name: "Mes voitures",
    redirect: "/myCars"
},
{
    name: "Deconnexion",
    redirect: "logout"
}];

// const déconnexion = e => {
//     e.preventDefault()
//     delete_cookie(cookieLoginUser)
//   }
export default function ProfilNav() {
    let navigate = useNavigate();
    const cookieLoginUser = 'login';
    const [info, setInfo] = useState();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const déconnexion = e => {//for déconnexion delete cookie (cookieLoginUser)
        e.preventDefault()
        delete_cookie(cookieLoginUser)
        navigate('/signin')
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        console.log("oui");
        setAnchorElUser(null);
    };
    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
                <IconButton sx={{ p: 0 }}>
                    <Avatar />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {settings.map((setting) => (
                    <MenuItem key={setting.name} onClick={handleCloseNavMenu}>
                        <Typography textAlign="center">{setting.name}</Typography>
                    </MenuItem>
                ))}

            </Menu>
        </Box>
    )
};
