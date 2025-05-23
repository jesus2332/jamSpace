// src/pages/RoomsPage.tsx
import React, { useState, useEffect } from 'react';
import { getAllRooms } from '../services/roomService';
import type { Room, PaginatedRoomResponse } from '../types/room';
import {
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Pagination 
} from '@mui/material';
import { Link as RouterLink } from 'react-router'; 

const RoomsPage: React.FC = () => {
  const [paginatedResponse, setPaginatedResponse] = useState<PaginatedRoomResponse | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0); 

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllRooms(currentPage, 6); 
        setPaginatedResponse(data);
        setRooms(data.content);
      } catch (err) {
        setError('Error al cargar las salas. Inténtalo de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [currentPage]); 

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value - 1); 
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" variant="h6">
        {error}
      </Typography>
    );
  }

  if (!paginatedResponse || rooms.length === 0) {
    return <Typography textAlign="center" variant="h6">No hay salas disponibles en este momento.</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom className="text-center mb-6 font-semibold">
        Nuestras Salas de Ensayo
      </Typography>
      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid key={room.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card className="h-full flex flex-col">
              <CardMedia
                component="img"
                // height="140" 
                className="h-48 object-cover" 
                image={room.imageUrl || 'https://via.placeholder.com/300x200?text=Sala+de+Ensayo'} 
                alt={room.name}
              />
              <CardContent className="flex-grow">
                <Typography gutterBottom variant="h5" component="div">
                  {room.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-1">
                  Capacidad: {room.capacity} personas
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-1">
                  Precio: ${room.pricePerHour.toFixed(2)} / hora
                </Typography>
                {room.description && (
                  <Typography variant="body2" color="text.secondary" className="truncate">
                    {room.description}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  component={RouterLink}
                  to={`/rooms/${room.id}`}
                >
                  Ver Detalles y Reservar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {paginatedResponse && paginatedResponse.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={paginatedResponse.totalPages}
            page={currentPage + 1} 
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </div>
  );
};

export default RoomsPage;