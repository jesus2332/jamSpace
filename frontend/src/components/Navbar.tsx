// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout} = useAuth(); 
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    if (isMobile) handleDrawerToggle(); 
  };

  const navLinkStyles = {
    marginRight: isMobile ? 0 : 2,
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: isMobile ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)',
    },
    display: 'flex',
    alignItems: 'center', 
    padding: isMobile ? '12px 16px' : '6px 8px', 
    width: isMobile ? '100%' : 'auto',
  };

  const commonNavLinks = [
    { text: 'Inicio', to: '/' },
    { text: 'Salas', to: '/rooms' },
  ];

  const authNavLinks = isAuthenticated
    ? [
        ...commonNavLinks,
        { text: 'Mis Reservas', to: '/my-bookings' },
      ]
    : commonNavLinks;

  const drawerContent = (
    <Box
      sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <MusicNoteIcon sx={{ mr: 1, fontSize: '2rem', color: 'secondary.main' }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          JamSpace
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {authNavLinks.map((link) => (
          <ListItem key={link.text} disablePadding component={RouterLink} to={link.to} sx={navLinkStyles}>
            <ListItemButton>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {isAuthenticated ? (
          <Button
            variant="outlined"
            fullWidth
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ borderColor: 'rgba(255, 255, 255, 0.7)', color: 'white' }}
          >
            Salir
          </Button>
        ) : (
          <>
            <Button
              component={RouterLink}
              to="/login"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mb: 1 }}
            >
              Ingresar
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              fullWidth
              variant="outlined"
              startIcon={<AppRegistrationIcon />}
              sx={{ borderColor: 'rgba(255, 255, 255, 0.7)', color: 'white' }}
            >
              Registrarse
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)' }}>
        <Toolbar sx={{ justifyContent: 'space-between', paddingX: { xs: 1, md: 3 } }}>
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <MusicNoteIcon sx={{ mr: 1, fontSize: '2rem', color: 'secondary.main' }} />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>
              JamSpace
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {authNavLinks.map((link) => (
                <Button
                  key={link.text}
                  color="inherit"
                  component={RouterLink}
                  to={link.to}
                  sx={navLinkStyles}
                >
                  {link.text}
                </Button>
              ))}
              {isAuthenticated ? (
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    color: 'white',
                    ml: 1,
                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                  }}
                >
                  Salir
                </Button>
              ) : (
                <>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/login"
                    sx={{ ...navLinkStyles, ml: 1 }}
                  >
                    Ingresar
                  </Button>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/register"
                    startIcon={<AppRegistrationIcon />}
                    sx={{
                      backgroundColor: 'white',
                      color: '#6B21A8', 
                      ml: 1,
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                    }}
                  >
                    Registrarse
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, bgcolor: 'background.paper' }, 
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Navbar;