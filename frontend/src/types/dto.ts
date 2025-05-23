// src/types/dto.ts
export interface RegisterRequestDTO {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }
  
  export interface LoginRequestDTO {
    usernameOrEmail: string;
    password: string;
  }