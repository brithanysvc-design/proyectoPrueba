// src/app/core/interceptors/idempotency.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class IdempotencyInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Solo agregar Idempotency-Key si no existe y es POST/PUT/PATCH
    if (
      (request.method === 'POST' || 
       request.method === 'PUT' || 
       request.method === 'PATCH') &&
      !request.headers.has('Idempotency-Key')
    ) {
      const idempotencyKey = this.generateIdempotencyKey();
      request = request.clone({
        setHeaders: {
          'Idempotency-Key': idempotencyKey
        }
      });
    }

    return next.handle(request);
  }

  private generateIdempotencyKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}
