// src/pages/MyBookingsPage.tsx
import React, { useState, useEffect } from 'react';
import { getMyBookings as fetchMyBookings, cancelBooking as apiCancelBooking } from '../services/bookingService';
import type { BookingResponse } from '../types/booking';
import {Link as RouterLink} from 'react-router'; 
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid, 
  Divider,
  Chip,
} from '@mui/material';
import { format, isFuture, differenceInHours } from 'date-fns';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CelebrationIcon from '@mui/icons-material/Celebration'; 
import { es } from 'date-fns/locale';

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<BookingResponse | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    setCancelError(null); 
    setCancelSuccess(null);
    try {
      const data = await fetchMyBookings(); 
      data.sort((a, b) => {
        const aIsFuture = isFuture(new Date(a.startTime));
        const bIsFuture = isFuture(new Date(b.startTime));
        if (aIsFuture && !bIsFuture) return -1;
        if (!aIsFuture && bIsFuture) return 1;
        if (aIsFuture && bIsFuture) return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      });
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar tus reservas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []); 

  const handleOpenCancelDialog = (booking: BookingResponse) => {
    setBookingToCancel(booking);
    setOpenCancelDialog(true);
    setCancelError(null); 
    setCancelSuccess(null);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setBookingToCancel(null);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      await apiCancelBooking(bookingToCancel.id);
      setCancelSuccess(`Reserva para "${bookingToCancel.roomName}" cancelada exitosamente.`);
      loadBookings(); 
    } catch (err: any) {
      setCancelError(err.message || 'Error al cancelar la reserva.');
    } finally {
      handleCloseCancelDialog();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 150px)" sx={{ color: 'secondary.main' }}>
        <CircularProgress color="inherit" size={50} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <Alert severity="error" variant="filled">
          <Typography variant="h6">Error al cargar reservas</Typography>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          fontWeight="bold"
          sx={{
            mb: { xs: 3, md: 5 },
            color: 'white', 
            textAlign: 'center',
          }}
        >
          Mis Reservas
        </Typography>

        {cancelError && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setCancelError(null)}>{cancelError}</Alert>}
        {cancelSuccess && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setCancelSuccess(null)}>{cancelSuccess}</Alert>}

        {bookings.length === 0 ? (
          <Paper 
            elevation={3} 
            sx={{ 
                padding: {xs: 3, sm: 4}, 
                textAlign: 'center', 
                backgroundColor: 'rgba(30, 41, 59, 0.8)', 
                borderRadius: '12px',
                maxWidth: 'sm',
                mx: 'auto'
            }}
          >
            <CelebrationIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{fontWeight: 'medium'}}>
              ¡Todo Listo para tu Próxima Jam Session!
            </Typography>
            <Typography color="text.secondary" sx={{mb:3}}>
              Aún no tienes reservas programadas. ¿Qué tal si exploras nuestras salas y encuentras tu espacio perfecto?
            </Typography>
            <Button variant="contained" color="secondary" component={RouterLink} to="/rooms">
                Ver Salas Disponibles
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {bookings.map((booking) => {
              const bookingStartTime = new Date(booking.startTime);
              const bookingEndTime = new Date(booking.endTime);
              const isPastBooking = !isFuture(bookingEndTime); 
              const canCancel = isFuture(bookingStartTime); 

              return (
                <Grid size={{xs: 12, md: 6}} key={booking.id}>
                  <Paper
                    elevation={isPastBooking ? 1 : 4}
                    sx={{
                      padding: 2.5,
                      borderRadius: '12px',
                      backgroundColor: isPastBooking ? 'rgba(30, 41, 59, 0.6)' : 'rgba(42, 55, 75, 0.7)', 
                      border: `1px solid ${isPastBooking ? 'rgba(51, 65, 85, 0.4)' : 'rgba(51, 65, 85, 0.7)'}`,
                      opacity: isPastBooking ? 0.75 : 1,
                      position: 'relative', 
                    }}
                  >
                    <Typography variant="h5" component="h3" fontWeight="bold" sx={{color: isPastBooking ? 'text.secondary' : 'secondary.light', mb: 1.5}}>
                      {booking.roomName}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" mb={1} color="text.secondary">
                      <EventIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {format(bookingStartTime, 'eeee, dd MMM yyyy', { locale: es })}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1.5} color="text.secondary">
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {format(bookingStartTime, 'HH:mm')} - {format(bookingEndTime, 'HH:mm')}
                        {' '}
                        ({differenceInHours(bookingEndTime, bookingStartTime)}h)
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.15)'}} />

                    <Box display="flex" alignItems="center" mb={1} color="text.secondary">
                        <MonetizationOnIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body1" fontWeight="medium">
                            Costo Total: ${booking.totalCost.toFixed(2)}
                        </Typography>
                    </Box>
                    <Typography variant="caption" display="block" color="text.disabled" sx={{mb: 2}}>
                        Reservado el: {format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}
                    </Typography>

                    {canCancel && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteForeverIcon />}
                        onClick={() => handleOpenCancelDialog(booking)}
                        sx={{ 
                            borderColor: 'rgba(239, 68, 68, 0.5)', 
                            color: 'error.light', 
                            '&:hover': {borderColor: 'error.main', backgroundColor: 'rgba(239, 68, 68, 0.1)'}
                        }}
                      >
                        Cancelar Reserva
                      </Button>
                    )}
                    {isPastBooking && !canCancel && (
                        <Chip label="Completada" size="small" sx={{backgroundColor: 'success.dark', color: 'white'}}/>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}

        <Dialog
          open={openCancelDialog}
          onClose={handleCloseCancelDialog}
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper', 
              backgroundImage: 'none' 
            }
          }}
        >
          <DialogTitle sx={{fontWeight: 'bold', color: 'primary.light'}}>Confirmar Cancelación</DialogTitle>
          <DialogContent>
            <DialogContentText color="text.secondary">
              ¿Estás seguro de que quieres cancelar la reserva para la sala "{bookingToCancel?.roomName}"
              el {bookingToCancel && format(new Date(bookingToCancel.startTime), 'dd/MM/yyyy \'a las\' HH:mm')}?
              <br />
              Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{padding: '16px 24px'}}>
            <Button onClick={handleCloseCancelDialog} color="inherit" sx={{color: 'text.secondary'}}>No, mantener</Button>
            <Button onClick={handleConfirmCancel} color="error" variant="contained" autoFocus>
              Sí, cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default MyBookingsPage;