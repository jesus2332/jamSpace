// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
} from '@mui/material';


const LoginPage: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null); 
    try {
      await login({ usernameOrEmail, password });
      
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });

    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales e inténtelo de nuevo.');
      console.error("LoginPage caught error during login attempt:", err); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" gutterBottom> 
          Iniciar Sesión
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ width: '100%', mt: 2, mb: 1 }}
            onClose={() => setError(null)} 
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: error ? 1 : 2, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="usernameOrEmail"
            label="Usuario o Email"
            name="usernameOrEmail"
            autoComplete="username" 
            autoFocus
            value={usernameOrEmail}
            onChange={(e) => {
              setUsernameOrEmail(e.target.value);
              if (error) setError(null); 
            }}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null); 
            }}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary" 
            sx={{ mt: 3, mb: 2, py: 1.2, fontSize:'1rem', fontWeight:'bold' }} 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
          </Button>
          <Grid container justifyContent="flex-end"> 
            <Grid>
              <RouterLink to="/register" style={{ textDecoration: 'none' }}>
                <Typography component="span" color="primary" sx={{ '&:hover': { textDecoration: 'underline' }}}>
                  ¿No tienes una cuenta? Regístrate aquí
                </Typography>
              </RouterLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;