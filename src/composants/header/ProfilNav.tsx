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
import { Badge } from '@mui/material';

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
});

const settings = [
    {
        name: "Profile",
        redirect: "/Profil"
    },
    {
        name: "Avis",
        redirect: "/profilAvis"
    },
    {
        name: "Mes voitures",
        redirect: "/profilVoiturs"
    },
    {
        name: "Messages",
        redirect: "/messages"
    },
    {
        name: "Deconnexion",
        redirect: "logout"
    }
];

type ImageModel = {
    path: string,
}
type UserModel = {
    firstname: string,
    lastname: string,
    email: string,
    description?: string,
    image_id?: number
    image?: ImageModel
}
export default function ProfilNav() {

    let navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [cookies, setCookie] = useCookies(['user']);
    const [user, setUser] = useState<UserModel>(null);

    const cookieUser = cookies.user;

    useEffect(() => {
        (async () => {
            try {
                const dataUser = await instance.get('user/current/session');
                setUser(dataUser.data);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const logout = async () => {//for déconnexion delete cookie (cookieLoginUser)
        await instance.get('logout')
            .then(response => {
                setAnchorElNav(null);
                setAnchorElUser(null)
                setCookie('user', '', { expires: new Date(0) });
                navigate('/');
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleMenuItemClick = (redirectUrl) => {
        window.location.href = redirectUrl;
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const NotLogin = (
        <Avatar />
    );
    let Login = null;// set value Login 
    if (cookieUser) {//if user is already connected
        Login = (
            <Tooltip title="Open settings">
                <Badge badgeContent={4} color="secondary">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt={user?.lastname} src={user?.image?.path} />
                    </IconButton>
                </Badge>

            </Tooltip>
        )
        if (!!user?.image_id) {//if user as image
            Login = (
                <Tooltip title="Open settings">
                    <Badge badgeContent={4} color="secondary">

                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt={user?.lastname} src={user?.image?.path} />

                        </IconButton>
                    </Badge>

                </Tooltip>
            )
        }
    }

    const goMessages = () => {
        navigate('/messages');
    }
    return (
        <Box sx={{ flexGrow: 0 }}>
            {cookieUser ? Login : NotLogin}
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
                    <MenuItem key={setting.name} onClick={() => handleMenuItemClick(setting.redirect)}>
                        {setting.name === 'Messages' ?
                            <Badge badgeContent={4} color="secondary">
                                <Typography textAlign="center" onClick={() => handleMenuItemClick(setting.redirect)}>{setting.name}</Typography>
                            </Badge>
                            :
                            <Typography textAlign="center" onClick={() => handleMenuItemClick(setting.redirect)}>{setting.name}</Typography>
                        }
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    )
};