import axios from 'axios';
import type { PaginatedRoomResponse, Room } from '../types/room'; 
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
//import API_URL from '../config';

const API_BASE_URL = `${API_BASE}/rooms` || 'http://localhost:8080/api/rooms';

export const getAllRooms = async (page: number = 0, size: number = 10, sort: string = 'id,asc'): Promise<PaginatedRoomResponse> => {
  try {
    const response = await axios.get<PaginatedRoomResponse>(`${API_BASE_URL}`, {
      params: { page, size, sort }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

export const getRoomById = async (id: number): Promise<Room> => {
  try {
    const response = await axios.get<Room>(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching room with id ${id}:`, error);
    throw error;
  }
};

// Crear una nueva sala 
// export const createRoom = async (roomData: Omit<Room, 'id'>): Promise<Room> => { ... }

// Actualizar una sala 
// export const updateRoom = async (id: number, roomData: Partial<Room>): Promise<Room> => { ... }

// Eliminar una sala 
// export const deleteRoom = async (id: number): Promise<void> => { ... }