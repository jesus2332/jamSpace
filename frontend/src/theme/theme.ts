// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Crea una instancia del tema.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6', // azul
    },
    secondary: {
      main: '#19857b', // verde azulado
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },

});

export default theme;