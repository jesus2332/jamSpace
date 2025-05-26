// src/components/rooms/RoomCard.tsx
import React from 'react';
import type { Room } from '../types/room'; // Ajusta la ruta según tu estructura
import { Card, CardMedia, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const imageSrc = room.imageUrl || '/images/rooms/default-room.svg'; 

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px', 
        backgroundColor: 'rgba(30, 41, 59, 0.7)', 
        backdropFilter: 'blur(8px)', 
        border: '1px solid rgba(51, 65, 85, 0.5)', 
        color: 'text.primary', 
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        },
      }}
    >
      <CardMedia
        component="img"
        className="h-56 object-cover" 
        image={imageSrc}
        alt={room.name}
        sx={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
      />
      <CardContent sx={{ flexGrow: 1, padding: 2.5 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom sx={{ color: 'secondary.main' }}>
          {room.name}
        </Typography>
        
        <Box display="flex" alignItems="center" mb={1} sx={{ color: 'text.secondary' }}>
          <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2">Capacidad: {room.capacity} personas</Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={2} sx={{ color: 'text.secondary' }}>
          <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2">
            ${room.pricePerHour.toFixed(2)} / hora
          </Typography>
        </Box>

        {room.description && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, 
            display: '-webkit-box',
            WebkitLineClamp: 3, 
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '3.6em' 
          }}>
            {room.description}
          </Typography>
        )}

        {room.equipment && room.equipment.length > 0 && (
          <Box mb={2} className="flex flex-wrap gap-1">
            {room.equipment.slice(0, 3).map((item, index) => (
              <Chip key={index} label={item} size="small" variant="outlined" sx={{borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)'}}/>
            ))}
            {room.equipment.length > 3 && <Chip label="..." size="small" variant="outlined" sx={{borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)'}}/>}
          </Box>
        )}
      </CardContent>
      
      <Box sx={{ padding: 2, paddingTop:0, marginTop: 'auto' }}> 
        <Button
          fullWidth
          variant="contained"
          color="secondary" 
          component={RouterLink}
          to={`/rooms/${room.id}`}
          endIcon={<ChevronRightIcon />}
          sx={{ 
            py: 1.2, 
            fontWeight: 'bold',
            borderRadius: '8px',
          }}
        >
          Ver Detalles y Reservar
        </Button>
      </Box>
    </Card>
  );
};

export default RoomCard;