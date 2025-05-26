// src/components/home/FeaturesSection.tsx
import React from 'react';
import { Container, Typography, Grid, Paper, Box, Chip, Avatar } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune'; 
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'; 
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'; 
import FlashOnIcon from '@mui/icons-material/FlashOn'; 

interface FeatureItemProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  bgColor: string; 
  iconBgColor: string; 
  iconColor: string; 
}

const FeatureCard: React.FC<FeatureItemProps> = ({ icon, title, description, bgColor, iconBgColor, iconColor }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        padding: 3,
        textAlign: 'center',
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', 
        alignItems: 'center',
        borderRadius: '16px', 
        background: bgColor, 
        color: 'white', 
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 20px -10px rgba(0,0,0,0.3)',
        },
      }}
    >
      <Avatar
        sx={{
          width: 64,
          height: 64,
          backgroundColor: iconBgColor, 
          marginBottom: 2,
        }}
      >
        {React.cloneElement(icon)}
      </Avatar>
      <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', flexGrow: 1 }}> 
        {description}
      </Typography>
    </Paper>
  );
};

const featuresData: FeatureItemProps[] = [
  {
    icon: <TuneIcon />,
    title: 'Equipos de alta gama',
    description: 'Equipos de alta gama, amplificadores y sistemas de sonido de las mejores marcas como Marshall, Fender, y DW Drums.',
    bgColor: 'rgba(126, 92, 204, 0.3)', 
    iconBgColor: 'rgba(126, 92, 204, 0.5)', 
    iconColor: '#c084fc', 
  },
  {
    icon: <ShieldOutlinedIcon />,
    title: 'Salas acústicamente aisladas',
    description: 'Salas acústicamente aisladas que te permiten tocar a cualquier volumen sin molestar a los demás.',
    bgColor: 'rgba(219, 99, 130, 0.3)', 
    iconBgColor: 'rgba(219, 99, 130, 0.5)',
    iconColor: '#f472b6', 
  },
  {
    icon: <AccessTimeFilledIcon />,
    title: 'Reservas flexibles',
    description: 'Sistema de reserva en línea disponible 24/7 para tu conveniencia.',
    bgColor: 'rgba(92, 139, 204, 0.3)', 
    iconBgColor: 'rgba(92, 139, 204, 0.5)',
    iconColor: '#60a5fa', 
  },
  {
    icon: <FlashOnIcon />,
    title: 'Ambiente creativo',
    description: 'Espacios pensados para inspirarte, con iluminación ambiental y diseño que estimula la creatividad musical.',
    bgColor: 'rgba(79, 170, 120, 0.3)', 
    iconBgColor: 'rgba(79, 170, 120, 0.5)',
    iconColor: '#34d399', 
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <Box
      sx={{
        paddingY: { xs: 6, md: 10 }, 
        background: 'linear-gradient(135deg, #1A0A31 0%, #2B0D4E 50%, #1A0A31 100%)', 
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={{ xs: 5, md: 8 }}>
          <Chip
            label="Nuestros Servicios"
            sx={{
              backgroundColor: 'rgba(107, 33, 168, 0.8)', 
              color: 'white',
              marginBottom: 2,
              paddingX: 1,
              fontSize: '0.9rem',
              height: 'auto',
              '& .MuiChip-label': {
                  paddingTop: '6px',
                  paddingBottom: '6px',
              }
            }}
          />
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem' },
              marginBottom: 2,
            }}
          >
            Todo lo que necesitas para tus ensayos
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{ color: 'rgba(229, 231, 235, 0.7)', maxWidth: '700px', marginX: 'auto' }} 
          >
            De equipos profesionales a espacios cómodos, proporcionamos todo lo que los músicos necesitan para ensayar, grabar y crear su mejor trabajo.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {featuresData.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;