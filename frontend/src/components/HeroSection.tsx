// src/components/layout/HeroSection.tsx
import React from 'react';
import { Box, Typography, Button, Paper, Grid, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 
import Container from '@mui/material/Container';

const HeroSection: React.FC = () => {
  return (
    <Box
      className="min-h-[calc(100vh-64px)]  bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, sm: 4, md: 6 },
        color: 'white',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Columna izq*/}
          <Grid size={{ xs: 12, md: 6 }}>
            <Chip
              label="El mejor lugar para ensayar"
              sx={{
                backgroundColor: 'rgba(170, 77, 255, 0.5)', 
                color: '#d8b4fe', 
                marginBottom: 2,
                paddingX: 1,
                height: 'auto',
                '& .MuiChip-label': {
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    fontSize: '0.8rem'
                }
              }}
            />
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4.5rem' },
                lineHeight: 1.1,
                marginBottom: 2,
              }}
            >
              Renta Tu  <br />
              <Box component="span" className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent " >
                Sala de Ensayo
              </Box>
              <br />
              Hoy Mismo!
            </Typography>
            <Typography variant="h6" component="p" sx={{ marginBottom: 4, color: 'rgba(255,255,255,0.8)' }}>
              Salas de ensayo equipadas con los mejores equipos para que puedas ensayar de manera cómoda y segura.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: {xs: 'wrap', sm: 'nowrap'} }}>
              <Button
                variant="contained"
                startIcon={<CalendarTodayIcon />}
                component={RouterLink}
                to="/rooms" 
                sx={{
                  backgroundColor: '#F02E99', 
                  color: 'white',
                  padding: '12px 28px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#D8288A',
                  },
                  flexShrink: 0
                }}
              >
                Reserva Ahora
              </Button>
              
            </Box>
           
          </Grid>

          {/* Columna derecha */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  mt: { xs: 4, md: 0 }}}>
            <Paper
              elevation={6}
              sx={{
                width: {xs: '90%', sm: '70%', md: '100%'},
                maxWidth: '600px', 
                aspectRatio: '1 / 1', 
                backgroundColor: 'rgba(229, 231, 235, 0.9)', 
                borderRadius: '20px', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden', 
              }}
            >
              <img src="hero2.png" alt="" className="w-full h-full object-cover" />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;