// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid
} from '@mui/material';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await register({ username, email, password, firstName, lastName });
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Error en el registro. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Crear Cuenta
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                id="username"
                label="Nombre de Usuario"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                name="password"
                label="Contraseña (minimo 8 caracteres)"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="firstName"
                label="Nombre"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="lastName"
                label="Apellido"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </Button>
          <Typography variant="body2" textAlign="center">
            ¿Ya tienes una cuenta?{' '}
            <RouterLink to="/login" style={{ textDecoration: 'none' }}>
              Inicia sesión aquí
            </RouterLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;