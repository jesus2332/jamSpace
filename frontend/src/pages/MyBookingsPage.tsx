// src/pages/MyBookingsPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMyBookings as fetchMyBookings, cancelBooking as apiCancelBooking } from '../services/bookingService' 
import type { BookingResponse } from '../types/booking'; 
import {
  Container, Typography, CircularProgress, Box, List, ListItem, ListItemText,
  Paper, Button, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { format } from 'date-fns'; 

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string|null>(null);
  const [cancelSuccess, setCancelSuccess] = useState<string|null>(null);

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<BookingResponse | null>(null);


  const loadBookings = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyBookings(); 
      setBookings(data);
    } catch (err) {
      setError('Error al cargar tus reservas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);


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
      setCancelSuccess(`Reserva para ${bookingToCancel.roomName} cancelada exitosamente.`);
      loadBookings();
    } catch (err: any) {
      setCancelError(err.message || 'Error al cancelar la reserva.');
    } finally {
      handleCloseCancelDialog();
    }
  };


  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh"><CircularProgress /></Box>;
  }
  if (error) {
    return <Alert severity="error" sx={{mt:2}}>{error}</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3, mb: 3 }}>
        Mis Reservas
      </Typography>
      {cancelError && <Alert severity="error" sx={{mb:2}}>{cancelError}</Alert>}
      {cancelSuccess && <Alert severity="success" sx={{mb:2}}>{cancelSuccess}</Alert>}

      {bookings.length === 0 ? (
        <Typography>No tienes reservas activas.</Typography>
      ) : (
        <List>
          {bookings.map((booking) => (
            <Paper key={booking.id} elevation={2} sx={{ mb: 2, p: 2 }}>
              <ListItem disableGutters sx={{display: 'block'}}>
                <Typography variant="h6">{booking.roomName}</Typography>
                <ListItemText
                  primary={`Desde: ${format(new Date(booking.startTime), 'dd/MM/yyyy HH:mm')}`}
                  secondary={`Hasta: ${format(new Date(booking.endTime), 'dd/MM/yyyy HH:mm')}`}
                />
                <ListItemText primary={`Costo Total: $${booking.totalCost.toFixed(2)}`} />
                <ListItemText secondary={`Reservado el: ${format(new Date(booking.createdAt), 'dd/MM/yyyy HH:mm')}`} />
                 {new Date(booking.startTime) > new Date() && ( 
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleOpenCancelDialog(booking)}
                        sx={{mt:1}}
                    >
                        Cancelar Reserva
                    </Button>
                 )}
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

        <Dialog
            open={openCancelDialog}
            onClose={handleCloseCancelDialog}
        >
            <DialogTitle>Confirmar Cancelación</DialogTitle>
            <DialogContent>
            <DialogContentText>
                ¿Estás seguro de que quieres cancelar la reserva para la sala "{bookingToCancel?.roomName}"
                el {bookingToCancel && format(new Date(bookingToCancel.startTime), 'dd/MM/yyyy \'a las\' HH:mm')}?
                Esta acción no se puede deshacer.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseCancelDialog}>No, mantener</Button>
            <Button onClick={handleConfirmCancel} color="error" autoFocus>
                Sí, cancelar
            </Button>
            </DialogActions>
        </Dialog>
    </Container>
  );
};

export default MyBookingsPage;