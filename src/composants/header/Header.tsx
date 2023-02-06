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
const instance = axios.create({
	baseURL: 'http://localhost:3001/api/',
});

export default function Header() {


	const [isConnected, setIsConnected] = useState(false);
	const [user, setUser] = useState();
	let navigate = useNavigate();

	useEffect(() => {
		(async () => {
			const link = window.location.pathname;
			if (link != '/forgot') {
				if (!link.startsWith('/forgot/')) {
					const check = await instance.get('check/user');
					if (check.data) {
						setIsConnected(true);
						const dataUser = await instance.get('user');
						setUser(dataUser.data);
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

	
	return (
		<AppBar position="static" sx={{zIndex: 1}}>
			<Toolbar>
				<Link sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					color: 'black',
					textDecoration: 'none'
				}} href='/home'>
					<img width='100%' height='100%' src='logo.png' alt="" />
					<h1>Ainori</h1>
				</Link>
				<Nav isConnected={isConnected} />
				<ProfilNav isConnected={isConnected}
					user={user} />
			</Toolbar>
		</AppBar>

	);
}