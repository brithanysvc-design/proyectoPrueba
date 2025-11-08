import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'https://your-api-url.com/api/reports';

  constructor(private http: HttpClient) {}

  getTransactionVolume(period: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/transaction-volume`, {
      params: { period }
    });
  }

  getTopClients(limit: number = 10): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/top-clients`, {
      params: { limit: limit.toString() }
    });
  }

  getDailyTransactions(startDate: Date, endDate: Date): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/daily-transactions`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  downloadReport(type: string, format: 'pdf' | 'excel'): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${type}`, {
      params: { format },
      responseType: 'blob'
    });
  }
}