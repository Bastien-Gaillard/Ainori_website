import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../cusotmization/palette';
import Nav from './Nav';
import ProfilNav from './ProfilNav';
import axios from 'axios';
const instance = axios.create({
	baseURL: 'http://localhost:3001/api/',
});

export default function Header({isConnected, user}) {

	return (
		<ThemeProvider theme={theme}>
			<AppBar position="static">
				<Container maxWidth="xl">
					<Toolbar>
						<img src='logo.png' alt="" />
						<Nav isConnected={isConnected} />
						<ProfilNav isConnected={isConnected}
							user={user} />
					</Toolbar>
				</Container>
			</AppBar>
		</ThemeProvider>

	);
}