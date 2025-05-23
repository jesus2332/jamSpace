// src/types/auth.ts
export interface User { // Podrías tener un tipo User más completo si es necesario
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isAdmin: boolean;
    // No incluir la contraseña aquí
  }
  
  export interface AuthResponse { // Para la respuesta de /register y /login
    accessToken?: string; // Para login
    tokenType?: string;   // Para login
    user?: User;          // Podría ser devuelto por register, o lo obtenemos por separado
    // La respuesta de register en nuestro backend devuelve UserResponseDTO
    // que mapea bien a nuestro tipo User de frontend.
    // La respuesta de login devuelve JwtAuthenticationResponseDTO.
  }
  
  // Para la respuesta de /register (UserResponseDTO del backend)
  export interface RegisterResponse extends User {}
  
  // Para la respuesta de /login (JwtAuthenticationResponseDTO del backend)
  export interface LoginResponse {
    accessToken: string;
    tokenType: string; // usualmente "Bearer"
  }