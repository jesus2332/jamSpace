// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router';
import { AppBar, Toolbar, Typography, Container, Button, Box, CircularProgress } from '@mui/material'; 
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage'; 
import RoomDetailPage from './pages/RoomDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import {useAuth} from './contexts/AuthContext';
import MyBookingsPage from './pages/MyBookingsPage'; 
import ProtectedRoute from './components/common/ProtectedRoute'; 


function App() {
  const { isLoading } = useAuth(); 

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{backgroundColor: '#0f172a'}}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
        <Navbar />

        <Box component="main" sx={{ flexGrow: 1, width: '100%', paddingTop: 0 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas Protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-bookings" element={<MyBookingsPage />} />
             
            </Route>
            
            {/* Ruta  para páginas no encontradas */}
            <Route path="*" element={
              <Container sx={{ textAlign: 'center', mt: 5, py: 5 }}>
                <Typography variant="h2" component="h1" gutterBottom sx={{color: 'secondary.main'}}>
                  404
                </Typography>
                <Typography variant="h5" gutterBottom>
                  ¡Ups! Página No Encontrada.
                </Typography>
                <Typography variant="body1" sx={{mb:3}}>
                  Parece que la página que buscas no existe o ha sido movida.
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/" 
                  variant="contained" 
                  color="secondary"
                  size="large"
                >
                  Volver al Inicio
                </Button>
              </Container>
            } />
          </Routes>
        </Box>

        <footer className="bg-gray-950 text-slate-400 text-center p-6 border-t border-slate-700">
          <p>© {new Date().getFullYear()} JamSpace Rehearsal Rooms. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}


export default App;