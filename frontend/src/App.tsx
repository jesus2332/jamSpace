// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router';
import { AppBar, Toolbar, Typography, Container, Button, Box, CircularProgress } from '@mui/material'; 

import RoomsPage from './pages/RoomsPage'; 
import RoomDetailPage from './pages/RoomDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import {useAuth} from './contexts/AuthContext';
import MyBookingsPage from './pages/MyBookingsPage'; 
import ProtectedRoute from './components/common/ProtectedRoute'; 
function App() {
  const { isAuthenticated, logout, user, isLoading } = useAuth(); 

  if (isLoading) { 
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen"> 
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                Rehearsal Rooms
              </RouterLink>
            </Typography>
            <Button color="inherit" component={RouterLink} to="/rooms">
              Salas
            </Button>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={RouterLink} to="/my-bookings">
                  Mis Reservas
                </Button>
                {user && (
                  <Typography sx={{ mr: 2, ml: 2, display: { xs: 'none', sm: 'block' } }}> 
                    Hola, {user.username}
                  </Typography>
                )}
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Registrarse
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Container component="main" sx={{ marginTop: '2rem', marginBottom: '2rem', flexGrow: 1 }}>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<RoomsPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas Protegidas */}
            <Route element={<ProtectedRoute />}> 
                  <Route path="/my-bookings" element={<MyBookingsPage />} />
              </Route>
         
            <Route path="*" element={
              <Box textAlign="center" mt={5}>
                <Typography variant="h4">404 - Página No Encontrada</Typography>
                <Button component={RouterLink} to="/" variant="contained" sx={{mt: 2}}>
                  Volver al Inicio
                </Button>
              </Box>
            } />
          </Routes>
        </Container>

        <footer className="bg-gray-800 text-white text-center p-4"> 
          <p>© {new Date().getFullYear()} Rehearsal Rooms. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;