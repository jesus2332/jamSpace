// src/types/auth.ts
export interface User { 
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isAdmin: boolean;
}
  
  export interface AuthResponse { 
    accessToken?: string; 
    tokenType?: string;   
    user?: User;          
    
  }
  
  export interface RegisterResponse extends User {}
  
  export interface LoginResponse {
    accessToken: string;
    tokenType: string; 
  }