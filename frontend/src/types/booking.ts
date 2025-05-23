// src/types/booking.ts
import type { Page } from "./common";

export interface BookingRequest {
  roomId: number;
  startTime: string; // ISO string
  endTime: string;   // ISO string
}

export interface BookingResponse {
  id: number;
  roomId: number;
  roomName: string;
  userId: number;
  username: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  createdAt: string; // ISO string
  totalCost: number; 
}

export type PaginatedBookingResponse = Page<BookingResponse>;