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
        setAnchorElUser(null)
        navigate('/login')
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
    const NotLogin = (
			<Avatar />
    )
	let Login=null;// set value Login 
	if(read_cookie(cookieLoginUser).length !=0){//if user is already connected
		Login = (
            <Tooltip title="Open settings">
			<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
				<Avatar alt={read_cookie(cookieLoginUser)[0].lastname} src="/static/images/avatar/2.jpg" />
			</IconButton> 
            </Tooltip> 
		)
		if(read_cookie(cookieLoginUser)[0].image != null ){//if user as image
			Login = (
                <Tooltip title="Open settings">
				<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
					<Avatar alt={read_cookie(cookieLoginUser)[0].lastname} src={read_cookie(cookieLoginUser)[0].image.path} />
				</IconButton> 
                </Tooltip>
			)
		}
	}
    return (
        <Box sx={{ flexGrow: 0 }}>
            {read_cookie(cookieLoginUser).length == 0 ?  NotLogin :  Login  }
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
                        <Typography textAlign="center" onClick={ setting.name === 'Deconnexion' ? déconnexion:null}>{setting.name}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    )
};
