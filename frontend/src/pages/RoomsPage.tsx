// src/pages/RoomsPage.tsx
import React, { useState, useEffect } from 'react';
import { getAllRooms } from '../services/roomService';
import type { PaginatedRoomResponse } from '../types/room'; 
import RoomCard from '../components/RoomCard'; 
import {
  CircularProgress,
  Typography,
  Grid,
  Box,
  Pagination,
  Container,
  Alert
} from '@mui/material';

const RoomsPage: React.FC = () => {
  const [paginatedResponse, setPaginatedResponse] = useState<PaginatedRoomResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0); 

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllRooms(currentPage, 6, 'name,asc'); 
        setPaginatedResponse(data);
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

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 10 }}>
          <CircularProgress color="secondary" size={50} />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 4, mx: 'auto', maxWidth: 'md' }}>
          {error}
        </Alert>
      );
    }

    if (!paginatedResponse || paginatedResponse.content.length === 0) {
      return (
        <Typography variant="h6" textAlign="center" sx={{ py: 10, color: 'text.secondary' }}>
          No hay salas disponibles en este momento.
        </Typography>
      );
    }

    return (
      <>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mb: 4 }}>
          {paginatedResponse.content.map((room) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={room.id} > 
              <RoomCard room={room} />
            </Grid>
          ))}
        </Grid>

        {paginatedResponse.totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={paginatedResponse.totalPages}
              page={currentPage + 1}
              onChange={handlePageChange}
              color="secondary" 
              size="large"
              sx={{
                '& .MuiPaginationItem-root': { 
                  color: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '& .Mui-selected': { 
                  backgroundColor: 'secondary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'secondary.dark',
                  }
                },
              }}
            />
          </Box>
        )}
      </>
    );
  };

  return (
    <Box className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" sx={{ 
      minHeight: 'calc(100vh - 64px - 73px)', 
      py: { xs: 4, md: 6 }, 
    }}>
      <Container maxWidth="xl"> 
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          textAlign="center"
          fontWeight="bold"
          sx={{ 
            mb: { xs: 4, md: 6 }, 
            color: 'white', 
          }}
        >
          Nuestras Salas de Ensayo
        </Typography>
        {renderContent()}
      </Container>
    </Box>
  );
};

export default RoomsPage;