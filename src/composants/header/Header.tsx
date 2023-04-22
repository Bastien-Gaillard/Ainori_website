import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { useState, useEffect } from 'react';
import theme from '../../cusotmization/palette';
import Nav from './Nav';
import ProfilNav from './ProfilNav';
import axios from 'axios';
import { Box, Link } from '@mui/material';
import { useCookies } from 'react-cookie';
const instance = axios.create({
	baseURL: 'http://localhost:3001/',
});

export default function Header({ socket, updateImage }) {
	const [cookies] = useCookies();
	const [isConnected, setIsConnected] = useState(false);
	const [user, setUser] = useState();
	const [image, setImage] = useState();

	let navigate = useNavigate();
	const cookieUser = cookies.user;

	const [navValue, setNavValue] = useState('');

	const handleNavChange = (newValue) => {
	  setNavValue(newValue);
	};

	useEffect(() => {
		console.log('image in header', updateImage);
	}, updateImage)

	useEffect(() => {
		(async () => {
			const link = window.location.pathname;
			if (link != '/forgot') {
				if (!link.startsWith('/forgot/')) {
				
					const check = await instance.get('user/check');
					if (check.data) {
						setIsConnected(true);
						if (link == '/') {
							navigate('/home');
							return;
						}
					} else {
						setIsConnected(false);
						navigate('/');
						return;
					}
				}
			}
		})();
	}, []);
	const NotLogin = (
		<AppBar position="relative" sx={{ zIndex: 1, height: '60px' }}>
			<Toolbar>
				<Link sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					color: 'black',
					textDecoration: 'none',
				}} >
					<img style={{width: '34px', height: '34px'}} src='logo.png' alt="" />
					<h1>Ainori</h1>
				</Link>
				<Nav value={navValue}/>
				<ProfilNav onNavChange={handleNavChange} socket={socket} updateImage={updateImage}/>
			</Toolbar>
		</AppBar>
    )
    const Login = (
		<AppBar position="relative" sx={{ zIndex: 1, height: '60px' }}>
			<Toolbar>
				<Link sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					color: 'black',
					textDecoration: 'none',
				}} href='/home'>
					<img style={{width: '34px', height: '34px'}} src='logo.png' alt="" />
					<h1>Ainori</h1>
				</Link>
				<Nav value={navValue}/>
				<ProfilNav onNavChange={handleNavChange} socket={socket} updateImage={updateImage}/>
			</Toolbar>
		</AppBar>
    )
    return (
        cookieUser ? Login : NotLogin
    );
}