
import type { Page } from './common';

export interface Room {
  id: number;
  name: string;
  capacity: number;
  equipment: string[];
  imageUrl?: string;
  description?: string;
  pricePerHour: number;
}

export type PaginatedRoomResponse = Page<Room>;