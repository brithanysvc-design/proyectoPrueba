// src/app/core/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error';

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 401:
              this.authService.logout();
              errorMessage = 'Sesión expirada. Por favor inicie sesión nuevamente.';
              break;
            case 403:
              errorMessage = 'No tiene permisos para realizar esta acción.';
              this.router.navigate(['/dashboard']);
              break;
            case 404:
              errorMessage = 'Recurso no encontrado.';
              break;
            case 409:
              errorMessage = error.error?.message || 'Conflicto en la operación.';
              break;
            case 422:
              errorMessage = error.error?.message || 'Datos inválidos.';
              break;
            case 500:
              errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
              break;
            default:
              errorMessage = error.error?.message || `Error: ${error.status}`;
          }
        }

        console.error('Error interceptado:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
