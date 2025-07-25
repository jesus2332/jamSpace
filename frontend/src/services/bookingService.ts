// src/services/bookingService.ts
import axios from 'axios';
import type { BookingRequest, BookingResponse } from '../types/booking'; 
//import API_URL from '../config';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_BOOKINGS_URL = `${API_BASE}/bookings`

export const createBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  try {
    const response = await axios.post<BookingResponse>(API_BOOKINGS_URL, bookingData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Error de red o desconocido al crear la reserva.');
  }
};
export const getMyBookings = async (page: number = 0, size: number = 10): Promise<BookingResponse[]> => {

  const response = await axios.get<BookingResponse[]>(`${API_BOOKINGS_URL}/my-bookings`, {
      params: { page, size } 
  });
  return response.data;
};

export const cancelBooking = async (bookingId: number): Promise<void> => {
    try {
        await axios.delete(`${API_BOOKINGS_URL}/${bookingId}`);
    } catch (error) {
         if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || `Error al cancelar reserva ${bookingId}`);
        }
        throw new Error(`Error de red o desconocido al cancelar reserva ${bookingId}`);
    }
};