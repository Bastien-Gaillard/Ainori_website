import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import theme from '../cusotmization/palette'
import { ThemeProvider } from '@mui/material/styles';
function Header() {

	return (
		<ThemeProvider theme={theme}>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2 }}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							Ainori
						</Typography>
						<Button color="inherit">Covoiturage</Button>
						<Button color="inherit">Mes trajets</Button>
						<Button color="inherit"><Link href='/signin'><Avatar alt="" src="" /></Link></Button>
					</Toolbar>
				</AppBar>
			</Box>
		</ThemeProvider>

	);
}

export default Header