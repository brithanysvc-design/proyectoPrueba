// src/app/core/models/user.model.ts
export enum UserRole {
  Client = 'Client',
  Manager = 'Manager',
  Admin = 'Admin'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}