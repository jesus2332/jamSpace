// src/pages/RoomDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink, useLocation } from 'react-router';
import { getRoomById } from '../services/roomService';
import * as bookingService from '../services/bookingService';
import type { Room } from '../types/room';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns'; 

const calculateDurationInHours = (start: Date | null, end: Date | null): number => {
  if (!start || !end || end.getTime() <= start.getTime()) return 0; 
  const diffMs = end.getTime() - start.getTime();
  return diffMs / (1000 * 60 * 60);
};

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchRoom = async () => {
        setLoading(true);
        setError(null);
        setBookingSuccess(null); 
        setBookingError(null);
        try {
          const roomId = parseInt(id, 10);
          if (isNaN(roomId)) {
            setError('ID de sala inválido.');
            setLoading(false);
            return;
          }
          const data = await getRoomById(roomId);
          setRoom(data);
        } catch (err) {
          setError('Error al cargar los detalles de la sala.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchRoom();
    } else {
      setError('No se proporcionó ID de sala.');
      setLoading(false);
    }
  }, [id]);

  const handleBookingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!room || !startTime || !endTime) {
      setBookingError('Por favor, selecciona una fecha y hora de inicio y fin.');
      return;
    }
    if (endTime.getTime() <= startTime.getTime()) { 
      setBookingError('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }
    if (!isAuthenticated) {
      setBookingError('Debes iniciar sesión para hacer una reserva.');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      const bookingData = {
        roomId: room.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      };
      const newBooking = await bookingService.createBooking(bookingData);
      setBookingSuccess(
        `¡Reserva para "${newBooking.roomName}" creada exitosamente de ${format(new Date(newBooking.startTime), 'dd/MM/yyyy HH:mm')} a ${format(new Date(newBooking.endTime), 'dd/MM/yyyy HH:mm')}! Puedes verla en "Mis Reservas".`
      );
      setStartTime(null);
      setEndTime(null);
    } catch (err: any) {
      setBookingError(err.message || 'Error al crear la reserva. La sala podría no estar disponible o los horarios son incorrectos.');
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
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
      <Typography color="error" textAlign="center" variant="h5" mt={4}>
        {error}
      </Typography>
    );
  }

  if (!room) {
    return <Typography textAlign="center" variant="h5" mt={4}>Sala no encontrada.</Typography>;
  }

  const imageSrc = room.imageUrl || '/images/rooms/default-room.svg'; 
  const durationHours = calculateDurationInHours(startTime, endTime);
  const estimatedCost = durationHours > 0 ? (durationHours * room.pricePerHour).toFixed(2) : "0.00";

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 3 }, mb: 4 }}>
      <Paper elevation={3} sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h3" component="h1" gutterBottom className="font-bold text-gray-800">
          {room.name}
        </Typography>

        <Grid container spacing={{ xs: 2, md: 4 }}>
          <Grid size={{xs: 12, md: 7}}>
            <Box
              component="img"
              sx={{
                width: '100%',
                maxHeight: { xs: 300, sm: 400, md: 450 },
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: 3,
              }}
              src={imageSrc}
              alt={room.name}
            />
          </Grid>
          <Grid size={{xs: 12, md: 5}}>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
              Detalles de la Sala
            </Typography>
            <List dense>
              <ListItem sx={{ pl: 0 }}>
                <ListItemIcon>
                  <PeopleIcon color="action" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{variant:'body1'}} primary={`Capacidad: ${room.capacity} personas`} />
              </ListItem>
              <ListItem sx={{ pl: 0 }}>
                <ListItemIcon>
                  <AttachMoneyIcon color="action" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{variant:'body1'}} primary={`Precio: $${room.pricePerHour.toFixed(2)} / hora`} />
              </ListItem>
            </List>

            {room.description && (
              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Descripción
                </Typography>
                <Typography variant="body1" paragraph sx={{whiteSpace: 'pre-line'}}>
                  {room.description}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        {room.equipment && room.equipment.length > 0 && (
          <Box mt={4}>
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
              Equipamiento Incluido
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {room.equipment.map((item, index) => (
                <Chip
                  key={index}
                  icon={<CheckCircleOutlineIcon fontSize="small" />}
                  label={item}
                  variant="outlined"
                  color="secondary"
                  size="medium"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Sección de Reserva */}
        <Box component="form" onSubmit={handleBookingSubmit} mt={5} py={3} borderTop={1} borderColor="divider">
          <Typography variant="h5" component="h2" gutterBottom className="text-center mb-4">
            Realizar una Reserva
          </Typography>

          {bookingError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setBookingError(null)}>{bookingError}</Alert>}
          {bookingSuccess && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setBookingSuccess(null)}>{bookingSuccess}</Alert>}

          {!isAuthenticated && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Por favor, 
              <RouterLink to="/login" state={{ from: location }} style={{ fontWeight: 'bold', color: 'inherit' }}>
                inicia sesión
              </RouterLink>
               o 
              <RouterLink to="/register" style={{ fontWeight: 'bold', color: 'inherit' }}>
                regrístrate
              </RouterLink>
               para poder realizar una reserva.
            </Alert>
          )}

          <Grid container spacing={2} alignItems="flex-start"> {/* alignItems a flex-start */}
            <Grid size={{xs: 12, sm: 6, md: 5}}>
              <DateTimePicker
                label="Inicio de la Reserva"
                value={startTime}
                onChange={(newValue) => { setStartTime(newValue); setBookingSuccess(null); setBookingError(null); }}
                ampm={false}
                disablePast
                minutesStep={30}
                sx={{ width: '100%' }}
                disabled={!isAuthenticated || bookingLoading}
                slotProps={{ textField: { helperText: "Selecciona fecha y hora de inicio" } }}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6, md: 5}}>
              <DateTimePicker
                label="Fin de la Reserva"
                value={endTime}
                onChange={(newValue) => { setEndTime(newValue); setBookingSuccess(null); setBookingError(null); }}
                ampm={false}
                disablePast
                minutesStep={30}
                minDateTime={startTime ? new Date(startTime.getTime() + 30 * 60000) : undefined}
                sx={{ width: '100%' }}
                disabled={!isAuthenticated || bookingLoading || !startTime}
                slotProps={{ textField: { helperText: "Selecciona fecha y hora de fin" } }}
              />
            </Grid>
            <Grid size={{xs: 12, md: 2}} sx={{ textAlign: { xs: 'center', md: 'left' }, mt: { xs: 2, md: 0 }, alignSelf: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={bookingLoading ? <CircularProgress size={20} color="inherit" /> : <EventAvailableIcon />}
                disabled={!isAuthenticated || bookingLoading || !startTime || !endTime || (endTime && startTime && endTime.getTime() <= startTime.getTime())}
                sx={{ width: {xs: '100%', md: 'auto'}}}
              >
                {bookingLoading ? 'Procesando...' : 'Reservar'}
              </Button>
            </Grid>
            {startTime && endTime && endTime.getTime() > startTime.getTime() && (
              <Grid size={{xs: 12, md: 2}} sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="action.hover" borderRadius={1}>
                  <Box display="flex" alignItems="center">
                    <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      Duración: {durationHours.toFixed(1)} horas
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary.main">
                    Costo Estimado: ${estimatedCost}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RoomDetailPage;