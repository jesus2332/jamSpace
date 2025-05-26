// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types/auth'; 
import * as authService from '../services/authService'; 
import axios from 'axios'; 
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: Parameters<typeof authService.loginUser>[0]) => Promise<void>;
  register: (userData: Parameters<typeof authService.registerUser>[0]) => Promise<void>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true); 
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken); 
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          console.log("AuthContext: Attempting to fetch user with stored token.");
          const currentUser = await authService.getMe();
          setUser(currentUser);
          console.log("AuthContext: User fetched successfully.", currentUser);
        } catch (error) {
          console.error("AuthContext: Failed to fetch user with stored token, logging out.", error);
          localStorage.removeItem('authToken');
          delete axios.defaults.headers.common['Authorization'];
          setToken(null); 
          setUser(null); 
        }
      }
      setIsLoading(false); 
    };
    initializeAuth();
  }, []); 

  const login = async (credentials: Parameters<typeof authService.loginUser>[0]) => {
    try {
      const response = await authService.loginUser(credentials); 
      setToken(response.accessToken);
      localStorage.setItem('authToken', response.accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
      
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch (error) { 
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      throw error; 
    }
  };

  const register = async (userData: Parameters<typeof authService.registerUser>[0]) => {
    try {
      await authService.registerUser(userData); 
    } catch (error) {
      throw error; 
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user && !!token, user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};