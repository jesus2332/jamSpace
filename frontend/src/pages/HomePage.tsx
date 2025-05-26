// src/pages/HomePage.tsx
import React from 'react';
import HeroSection from '../components/HeroSection'; 
import FeaturesSection from '../components/FeaturesSection';
import { Box } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <Box> 
      <HeroSection />
      <FeaturesSection />
    </Box>
  );
};

export default HomePage;