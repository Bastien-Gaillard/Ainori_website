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
import Nav from './Nav';
import ProfilNav from './ProfilNav';

const pages = ['Products', 'Pricing', 'Blog'];
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


export default function Header() {
	let navigate = useNavigate();
	const cookieLoginUser = 'login';
	const [info, setInfo] = useState();
	const [anchorElNav, setAnchorElNav] = useState(null);
	const [anchorElUser, setAnchorElUser] = useState(null);

	const deconnexion = e => {//for déconnexion delete cookie (cookieLoginUser)
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
	//console.log(read_cookie(cookieLoginUser))

	//if not login
	const NotLogin = (
		<IconButton sx={{ p: 0 }}>
			<Avatar />
		</IconButton>
	)
	// const Login = (
	// 	<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
	// 		<Avatar alt={read_cookie(cookieLoginUser)[0].lastname} src={read_cookie(cookieLoginUser)[0].image.path} />
	// 	</IconButton>
	// )

	return (
		<ThemeProvider theme={theme}>
			<AppBar position="static">
				<Container maxWidth="xl">
					<Toolbar>
						<img src='logo.png' alt="" />
						<Nav />
						<ProfilNav />
					</Toolbar>
				</Container>
			</AppBar>
		</ThemeProvider>

	);
}
