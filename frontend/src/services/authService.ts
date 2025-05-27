// src/services/authService.ts
import axios from 'axios';
import type { LoginResponse, RegisterResponse } from '../types/auth'; 
import type { User } from '../types/auth'; 
//import API_URL from '../config';
//const API_AUTH_URL = '/api/auth'; 
//const API_AUTH_URL = `${API_URL}/auth` || '/api/auth'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_AUTH_URL = `${API_BASE_URL}/auth`;
interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginData {
  usernameOrEmail: string;
  password: string;
}

export const registerUser = async (userData: RegisterData): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(`${API_AUTH_URL}/register`, userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error en el registro');
    }
    throw new Error('Error de red o desconocido en el registro');
  }
};
//const API_USERS_URL = '/api/users'; 
const API_USERS_URL = `${API_BASE_URL}/users`;
export const getMe = async (): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_USERS_URL}/me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

export const loginUser = async (credentials: LoginData): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_AUTH_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
        if (error.response.data && error.response.data.message) {
             throw new Error(error.response.data.message);
        } else if (error.response.status === 401) {
            throw new Error('Credenciales incorrectas.');
        }
        throw new Error('Error en el inicio de sesión.');
    }
    throw new Error('Error de red o desconocido al iniciar sesión');
  }
};

