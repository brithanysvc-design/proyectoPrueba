// src/app/core/models/auth.model.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  identification?: string;
  phone?: string;
}
