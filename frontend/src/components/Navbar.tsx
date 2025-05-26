// src/components/layout/Navbar.tsx
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote'; 
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(5px)'}}>
      <Toolbar sx={{ justifyContent: 'space-between', paddingX: { xs: 2, md: 3 } }}>
        <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <MusicNoteIcon sx={{ mr: 1, fontSize: '2rem', color: '#E040FB' }} /> 
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>
            JamSpace
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ marginRight: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            Inicio
          </Button>
          {isAuthenticated ? (
            <>
            <Button
                color="inherit"
                component={RouterLink}
                to="/rooms"
                sx={{ marginRight: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                Salas
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/my-bookings"
                sx={{ marginRight: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                Mis Reservas
              </Button>
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{ 
                    borderColor: 'rgba(255, 255, 255, 0.7)', 
                    color: 'white',
                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)'} 
                }}
              >
                Salir
              </Button>
            </>
          ) : (
            <>
            <Button
                color="inherit"
                component={RouterLink}
                to="/rooms"
                sx={{ marginRight: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                Salas
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ marginRight: 2, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                Ingresar
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to="/register"
                sx={{ 
                    backgroundColor: 'white', 
                    color: '#6B21A8', 
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
                }}
              >
                Registrarse
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;