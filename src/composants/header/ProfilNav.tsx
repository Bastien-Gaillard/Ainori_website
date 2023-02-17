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

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

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

export default ({
    isConnected,
    user
}: {
    isConnected: Boolean,
    user?: any
}) => {
    let navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const logout = async () => {//for déconnexion delete cookie (cookieLoginUser)
        await instance.get('logout')
        .then(response => {
            navigate('/');
          })
          .catch(error => {
            console.error(error);
          });
    }
    useEffect(() => {
	}, [isConnected, user]);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const NotLogin = (
        <Avatar />
    );
    let Login=null;// set value Login 
    if(isConnected){//if user is already connected
    	Login = (
            <Tooltip title="Open settings">
    		<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
    			<Avatar alt={user?.lastname} src={user?.image?.path} />
    		</IconButton> 
            </Tooltip> 
    	)
    	if(!!user?.image_id){//if user as image
    		Login = (
                <Tooltip title="Open settings">
    			<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.lastname} src={user?.lastname} />
    			</IconButton> 
                </Tooltip>
    		)
    	}
    }

    return (
        <Box sx={{ flexGrow: 0 }}>
            {isConnected ? Login : NotLogin}
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
                        <Typography textAlign="center" onClick={ setting.name === 'Deconnexion' ? logout : null}>{setting.name}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    )
};