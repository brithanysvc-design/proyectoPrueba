// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://your-api-url.com/api'; // Cambiar por tu API
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private failedAttempts = 0;
  private lockoutTime: Date | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    // Verificar bloqueo
    if (this.isLocked()) {
      throw new Error('Cuenta bloqueada. Intente nuevamente en 15 minutos.');
    }

    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.failedAttempts = 0;
            this.setSession(response.data);
          } else {
            this.handleFailedAttempt();
          }
        })
      );
  }

  register(data: RegisterRequest): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/auth/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('user', JSON.stringify(authResult.user));
    this.currentUserSubject.next(authResult.user);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch (e) {
      return true;
    }
  }

  private handleFailedAttempt(): void {
    this.failedAttempts++;
    if (this.failedAttempts >= 5) {
      this.lockoutTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      localStorage.setItem('lockoutTime', this.lockoutTime.toISOString());
    }
  }

  private isLocked(): boolean {
    const lockoutStr = localStorage.getItem('lockoutTime');
    if (lockoutStr) {
      const lockout = new Date(lockoutStr);
      if (lockout > new Date()) {
        return true;
      } else {
        localStorage.removeItem('lockoutTime');
        this.failedAttempts = 0;
      }
    }
    return false;
  }
}