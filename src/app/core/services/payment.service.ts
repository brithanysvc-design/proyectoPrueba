// src/app/core/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment, ServiceProvider } from '../models/payment.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://your-api-url.com/api';

  constructor(private http: HttpClient) {}

  getServiceProviders(): Observable<ApiResponse<ServiceProvider[]>> {
    return this.http.get<ApiResponse<ServiceProvider[]>>(`${this.apiUrl}/service-providers`);
  }

  getProviderById(id: string): Observable<ApiResponse<ServiceProvider>> {
    return this.http.get<ApiResponse<ServiceProvider>>(`${this.apiUrl}/service-providers/${id}`);
  }

  executePayment(data: {
    providerId: string;
    contractNumber: string;
    amount: number;
    sourceAccountId: string;
  }): Observable<ApiResponse<Payment>> {
    return this.http.post<ApiResponse<Payment>>(`${this.apiUrl}/payments`, data);
  }

  schedulePayment(data: {
    providerId: string;
    contractNumber: string;
    amount: number;
    sourceAccountId: string;
    scheduledDate: Date;
  }): Observable<ApiResponse<Payment>> {
    return this.http.post<ApiResponse<Payment>>(`${this.apiUrl}/payments/schedule`, data);
  }

  getScheduledPayments(): Observable<ApiResponse<Payment[]>> {
    return this.http.get<ApiResponse<Payment[]>>(`${this.apiUrl}/payments/scheduled`);
  }

  cancelScheduledPayment(id: string): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/payments/${id}/cancel`, {});
  }

  downloadReceipt(paymentId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/payments/${paymentId}/receipt`, {
      responseType: 'blob'
    });
  }
}
