// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

// Crea una instancia del tema.
const theme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#9333ea', 
    },
    secondary: {
      main: '#F02E99', 
    },
    background: {
      default: '#0f172a', 
      paper: '#1e293b',   
    },
    text: {
        primary: '#f8fafc', 
        secondary: '#cbd5e1' 
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },

});

export default theme;