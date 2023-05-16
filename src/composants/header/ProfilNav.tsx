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

const settings = [
    {
        name: "Profil",
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
export default function ProfilNav({ onNavChange, socket, updateImage, role }) {

    let navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [user, setUser] = useState<UserModel>(null);
    const [image, setImage] = useState(updateImage)
    const [messages, setMessages] = useState([]);
    const cookieUser = cookies.user;


    const handleClick = () => {
        onNavChange('other');
    };


    useEffect(() => {
        (async () => {
            try {
                const dataUser = await instance.get('user/current/id');
                console.log('datauser', dataUser.data);
                setUser(dataUser.data);
                if(dataUser.data.image?.path){
                    setImage(dataUser.data.image?.path);
                }
            } catch (error) {
                console.error(error);
            }
        })();
    }, [updateImage]);

    useEffect(() => {
        setImage(updateImage);
    }, [updateImage]);

    const logout = async () => {//for déconnexion delete cookie (cookieLoginUser)
        await instance.get('logout')
            .then(response => {
                setAnchorElNav(null);
                setAnchorElUser(null)
                removeCookie('user');
                navigate('/');
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleMenuItemClick = (redirectUrl) => {
        handleClick();
        navigate(redirectUrl);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    let Login = null;// set value Login 
    if (cookieUser) {//if user is already connected
        Login = (
            <Tooltip title="Open settings">
                {/* <Badge badgeContent={4} color="secondary"> */}
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: '1.4px solid black' }}>
                    <Avatar alt={user?.lastname} src={image} />
                </IconButton>
                {/* </Badge> */}

            </Tooltip>
        )
        if (!!user?.image_id) {//if user as image
            Login = (
                <Tooltip title="Open settings">
                    {/* <Badge badgeContent={4} color="secondary"> */}

                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt={user?.lastname} src={image} />

                    </IconButton>
                    {/* </Badge> */}

                </Tooltip>
            )
        }
    }

    return (
        <Box sx={{ flexGrow: 0 }}>
            {cookieUser && Login}
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
                        {setting.name === 'Messages' ? (
                            // <Badge badgeContent={4} color="secondary">
                            <Typography textAlign="center" onClick={() => handleMenuItemClick(setting.redirect)}>{setting.name}</Typography>
                            // </Badge>
                        ) : (
                            <Typography textAlign="center" onClick={() => handleMenuItemClick(setting.redirect)}>{setting.name}</Typography>
                        )}
                    </MenuItem>
                ))}
                <MenuItem onClick={logout} id='logout'>Déconnexion</MenuItem>
            </Menu>
        </Box>
    )
};