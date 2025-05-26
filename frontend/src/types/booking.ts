// src/types/booking.ts
import type { Page } from "./common";

export interface BookingRequest {
  roomId: number;
  startTime: string; 
  endTime: string;   
}

export interface BookingResponse {
  id: number;
  roomId: number;
  roomName: string;
  userId: number;
  username: string;
  startTime: string; 
  endTime: string;   
  createdAt: string; 
  totalCost: number; 
}

export type PaginatedBookingResponse = Page<BookingResponse>;