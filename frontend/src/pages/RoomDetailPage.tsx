import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link as RouterLink, useLocation } from 'react-router';
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
  Divider,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { format, isSameDay, addHours, startOfHour, setHours, setMinutes, setSeconds, setMilliseconds, isBefore, parseISO, getHours } from 'date-fns'; 
import { es } from 'date-fns/locale';

const EARLIEST_BOOKING_HOUR = 10; 
const LATEST_BOOKING_END_HOUR = 23; 

const calculateDurationInHours = (start: Date | null, end: Date | null): number => {
  if (!start || !end || end.getTime() <= start.getTime()) return 0;
  const diffMs = end.getTime() - start.getTime();
  const duration = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(1));
  return duration;
};

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const minBookingStartTime = useMemo(() => {
    const now = new Date();
    let nextHourStart = startOfHour(addHours(now, 1));
    const earliestTimeToday = setMilliseconds(setSeconds(setMinutes(setHours(new Date(now), EARLIEST_BOOKING_HOUR), 0), 0), 0);

    if (isSameDay(nextHourStart, earliestTimeToday) && isBefore(nextHourStart, earliestTimeToday)) {
      nextHourStart = earliestTimeToday;
    }
    return nextHourStart;
  }, []);


  useEffect(() => {
    if (id) {
      const fetchRoom = async () => {
        setLoading(true);
        setError(null);
        setBookingSuccess(null);
        setBookingError(null);
        setStartTime(null);
        setEndTime(null);
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

  const validateBookingTimes = (): boolean => {
    if (!startTime || !endTime) {
      setBookingError('Por favor, selecciona una fecha y hora de inicio y fin.');
      return false;
    }
    if (endTime.getTime() <= startTime.getTime()) {
      setBookingError('La hora de fin debe ser posterior a la hora de inicio.');
      return false;
    }
    if (!isSameDay(startTime, endTime)) {
      setBookingError('La reserva debe comenzar y terminar el mismo día.');
      return false;
    }

    const startHour = getHours(startTime);
    const endHour = getHours(endTime); 

    if (startHour < EARLIEST_BOOKING_HOUR) {
        setBookingError(`La hora de inicio debe ser a partir de las ${EARLIEST_BOOKING_HOUR}:00.`);
        return false;
    }
    if (startHour >= LATEST_BOOKING_END_HOUR) { 
        setBookingError(`La hora de inicio debe ser antes de las ${LATEST_BOOKING_END_HOUR}:00.`);
        return false;
    }
    if (endHour > LATEST_BOOKING_END_HOUR) {
        setBookingError(`La hora de fin no puede ser después de las ${LATEST_BOOKING_END_HOUR}:00.`);
        return false;
    }
    
    if (endHour === 0 && LATEST_BOOKING_END_HOUR !== 23) {
        setBookingError(`Las reservas deben terminar antes de la medianoche a menos que el cierre sea a las 23:00 (terminando a las 00:00).`);
        return false;
    }
    
    if (startHour < EARLIEST_BOOKING_HOUR || endHour > LATEST_BOOKING_END_HOUR || (endHour === 0 && LATEST_BOOKING_END_HOUR !== 23)) {
        setBookingError(`Las reservas deben de estar entre ${EARLIEST_BOOKING_HOUR}:00 y ${LATEST_BOOKING_END_HOUR}:00 del mismo día en el horario disponible.`);
        return false;
    }


    setBookingError(null); 
    return true;
  };


  const handleBookingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateBookingTimes()) { 
        return;
    }
    
    if (!isAuthenticated) { 
      setBookingError('Debes iniciar sesión para hacer una reserva.');
      return;
    }
   

    setBookingLoading(true);
    setBookingSuccess(null);

    try {
      const bookingData = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        roomId: room!.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        startTime: startTime!.toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        endTime: endTime!.toISOString(),
      };
      const newBooking = await bookingService.createBooking(bookingData);
      setBookingSuccess(
        `¡Reserva para "${newBooking.roomName}" creada exitosamente de ${format(parseISO(newBooking.startTime), 'dd/MM/yyyy HH:mm', { locale: es })} a ${format(parseISO(newBooking.endTime), 'dd/MM/yyyy HH:mm', { locale: es })}! Puedes verla en "Mis Reservas".`
      );
      setStartTime(null);
      setEndTime(null);
    } catch (err: any) {
      setBookingError(err.message || 'Error al crear la reserva. La sala podría no estar disponible o los horarios/fechas son incorrectos.');
      console.error(err);
    } finally {
      setBookingLoading(false);
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
          <Typography variant="h6">Error</Typography>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!room) {
    return (
      <Container maxWidth="sm" sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary">Sala no encontrada.</Typography>
      </Container>
    );
  }

  const imageSrc = `/${room.imageUrl}`;
  const durationHours = calculateDurationInHours(startTime, endTime);
  const estimatedCost = durationHours > 0 && room.pricePerHour ? (durationHours * room.pricePerHour).toFixed(2) : "0.00";

  return (
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Paper
          elevation={6}
          sx={{
            padding: { xs: 2, sm: 3, md: 4 },
            backgroundColor: 'rgba(30, 41, 59, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(51, 65, 85, 0.6)',
            borderRadius: '16px',
            color: 'text.primary'
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ color: 'secondary.main', mb: 3, textAlign: { xs: 'center', md: 'left' } }}
          >
            {room.name}
          </Typography>

          <Grid container spacing={{ xs: 3, md: 5 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                component="img"
                sx={{
                  width: '100%',
                  maxHeight: { xs: 300, sm: 400, md: 500 },
                  objectFit: 'cover',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                src={imageSrc}
                alt={room.name}
              />
              {room.equipment && room.equipment.length > 0 && (
                <Box mt={4}>
                  <Typography variant="h5" gutterBottom sx={{ color: 'primary.light', fontWeight: 'medium' }}>
                    Equipamiento Incluido
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1.5}>
                    {room.equipment.map((item, index) => (
                      <Chip
                        key={index}
                        icon={<CheckCircleOutlineIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />}
                        label={item}
                        sx={{
                          backgroundColor: 'rgba(51, 65, 85, 0.7)',
                          color: 'rgba(255,255,255,0.9)',
                          border: '1px solid rgba(71, 85, 105, 0.8)',
                          fontSize: '0.9rem'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ color: 'primary.light', fontWeight: 'medium', mb: 2 }}>
                Detalles de la Sala
              </Typography>
              <List dense sx={{ mb: 3 }}>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}><PeopleIcon sx={{ color: 'secondary.light' }} /></ListItemIcon>
                  <ListItemText primaryTypographyProps={{ variant: 'body1' }} primary={`Capacidad: ${room.capacity} personas`} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 36 }}><AttachMoneyIcon sx={{ color: 'secondary.light' }} /></ListItemIcon>
                  <ListItemText primaryTypographyProps={{ variant: 'body1' }} primary={`Precio: $${room.pricePerHour.toFixed(2)} / hora`} />
                </ListItem>
              </List>

              {room.description && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.light', fontWeight: 'medium', mt: 3 }}>
                    Descripción
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line', color: 'text.secondary', lineHeight: 1.7 }}>
                    {room.description}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: { xs: 4, md: 5 }, borderColor: 'rgba(255,255,255,0.2)' }} />

          <Box component="form" onSubmit={handleBookingSubmit}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: 'primary.light' }}>
              Realiza tu Reserva
            </Typography>

            {bookingError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setBookingError(null)}>{bookingError}</Alert>}
            {bookingSuccess && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setBookingSuccess(null)}>{bookingSuccess}</Alert>}

            {!isAuthenticated && (
              <Alert
                severity="info"
                icon={<InfoOutlinedIcon />}
                sx={{
                  mb: 3,
                  backgroundColor: 'rgba(30,58,138,0.3)',
                  color: '#e0e7ff'
                }}
              >
                Por favor,{' '}
                <RouterLink to="/login" state={{ from: location }} className="font-semibold underline hover:text-indigo-300">
                  inicia sesión
                </RouterLink>
                {' '}o{' '}
                <RouterLink to="/register" className="font-semibold underline hover:text-indigo-300">
                  regrístrate
                </RouterLink>
                {' '}para poder realizar una reserva.
              </Alert>
            )}

            <Grid container spacing={2} alignItems="flex-start" justifyContent="center">
              <Grid size={{ xs: 12, md: 5 }}>
                <DateTimePicker
                  label="Inicio de la Reserva"
                  value={startTime}
                  onChange={(newValue) => {
                    setStartTime(newValue);
                    if (newValue) {
                        const nextPossibleEndTime = startOfHour(addHours(newValue, 1));
                        if (endTime && !isSameDay(newValue, endTime)) {
                            setEndTime(nextPossibleEndTime);
                        } else if (!endTime || newValue.getTime() >= (endTime?.getTime() || 0) ) {
                            setEndTime(nextPossibleEndTime);
                        }
                    } else {
                        setEndTime(null);
                    }
                    setBookingSuccess(null);
                    setBookingError(null); 
                  }}
                  ampm={false}
                  minDateTime={minBookingStartTime}
                  minutesStep={60}
                  sx={{ width: '100%' }}
                  disabled={!isAuthenticated || bookingLoading}
                  slotProps={{
                    textField: {
                      helperText: `Próxima reserva: ${format(minBookingStartTime, 'dd/MM HH:mm')} (Horario ${EARLIEST_BOOKING_HOUR}:00-${LATEST_BOOKING_END_HOUR}:00)`,
                      sx: { '.MuiFormHelperText-root': { color: 'text.secondary' } }
                    },
                    openPickerButton: { color: 'secondary' }
                  }}
                  shouldDisableTime={(timeValue, clockType) => {
                    if (clockType === 'hours') {
                      const hour = getHours(timeValue);
                      if (hour < EARLIEST_BOOKING_HOUR || hour >= LATEST_BOOKING_END_HOUR) {
                        return true;
                      }
                    }
                    return false;
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <DateTimePicker
                  label="Fin de la Reserva"
                  value={endTime}
                  onChange={(newValue) => {
                    setEndTime(newValue);
                    setBookingSuccess(null);
                    setBookingError(null); 
                  }}
                  ampm={false}
                  minDateTime={startTime ? startOfHour(addHours(startTime, 1)) : undefined}
                  sx={{ width: '100%' }}
                  disabled={!isAuthenticated || bookingLoading || !startTime}
                  minutesStep={60}
                  minDate={startTime ? new Date(startTime) : undefined}
                  maxDate={startTime ? new Date(startTime) : undefined}
                  slotProps={{
                    textField: {
                      helperText: `Fin el mismo día (hasta ${LATEST_BOOKING_END_HOUR}:00)`,
                      sx: { '.MuiFormHelperText-root': { color: 'text.secondary' } }
                    },
                    openPickerButton: { color: 'secondary' }
                  }}
                  shouldDisableTime={(timeValue, clockType) => {
                    if (clockType === 'hours' && startTime) {
                      const hour = getHours(timeValue);
                      if (!isSameDay(timeValue, startTime)) {
                        return true;
                      }
                      if (hour <= getHours(startTime)) return true;
                      if (hour > LATEST_BOOKING_END_HOUR) return true;
                    }
                    return false;
                  }}
                />
              </Grid>
              {startTime && endTime && endTime.getTime() > startTime.getTime() && isSameDay(startTime, endTime) && (
                <Grid size={{ xs: 12, md: 10 }} sx={{ mt: 1, mb: 1 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={{ xs: 1.5, sm: 2 }}
                    sx={{
                      backgroundColor: 'rgba(51, 65, 85, 0.5)',
                      borderRadius: '8px',
                      border: '1px solid rgba(71, 85, 105, 0.7)'
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <AccessTimeIcon sx={{ mr: 1, color: 'secondary.light' }} />
                      <Typography variant="body1">
                        Duración: {durationHours.toFixed(1)} hora(s)
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
                      Costo: ${estimatedCost}
                    </Typography>
                  </Box>
                </Grid>
              )}
              <Grid size={{ xs: 12, md: 10 }} sx={{ textAlign: 'center', mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  startIcon={bookingLoading ? <CircularProgress size={24} color="inherit" /> : <EventAvailableIcon />}
                  disabled={
                    !isAuthenticated ||
                    bookingLoading ||
                    !startTime ||
                    !endTime ||
                    (endTime && startTime && endTime.getTime() <= startTime.getTime()) ||
                    (startTime && endTime && !isSameDay(startTime, endTime)) ||
                    durationHours <= 0
                  }
                  sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  {bookingLoading ? 'Procesando Reserva...' : 'Confirmar y Reservar'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RoomDetailPage;