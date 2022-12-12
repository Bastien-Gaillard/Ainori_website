import { createTheme, Theme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#00BCD4',
      light: '#B2EBF2',
      dark: '#0597A7',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffc107',
      light: '#B2EBF2',
      dark: '#B2EBF2',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
});

export default theme;