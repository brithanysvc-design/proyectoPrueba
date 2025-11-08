// src/app/core/services/transaction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, TransactionStatus } from '../models/transaction.model';
import { TransferPreview } from '../models/transfer-preview.model';
import { ApiResponse } from '../models/api-response.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'https://your-api-url.com/api/transactions';

  constructor(private http: HttpClient) {}

  previewTransfer(data: {
    sourceAccountId: string;
    destinationAccountId?: string;
    beneficiaryId?: string;
    amount: number;
  }): Observable<ApiResponse<TransferPreview>> {
    return this.http.post<ApiResponse<TransferPreview>>(`${this.apiUrl}/preview`, data);
  }

  executeTransfer(data: {
    sourceAccountId: string;
    destinationAccountId?: string;
    beneficiaryId?: string;
    amount: number;
    description?: string;
  }): Observable<ApiResponse<Transaction>> {
    const idempotencyKey = uuidv4();
    const headers = new HttpHeaders({
      'Idempotency-Key': idempotencyKey
    });

    return this.http.post<ApiResponse<Transaction>>(
      `${this.apiUrl}/transfer`,
      { ...data, idempotencyKey },
      { headers }
    );
  }

  scheduleTransfer(data: {
    sourceAccountId: string;
    destinationAccountId?: string;
    beneficiaryId?: string;
    amount: number;
    scheduledDate: Date;
    description?: string;
  }): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(`${this.apiUrl}/schedule`, data);
  }

  cancelScheduledTransaction(id: string): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/${id}/cancel`, {});
  }

getTransactionHistory(filters?: {
  accountId?: string;
  startDate?: Date;
  endDate?: Date;
  type?: string;
  status?: TransactionStatus;
}): Observable<ApiResponse<Transaction[]>> {

  // Convertimos Date a string
  const params: Record<string, string> = {};
  if (filters) {
    if (filters.accountId) params['accountId'] = filters.accountId;
    if (filters.startDate) params['startDate'] = filters.startDate.toISOString();
    if (filters.endDate) params['endDate'] = filters.endDate.toISOString();
    if (filters.type) params['type'] = filters.type;
    if (filters.status) params['status'] = filters.status; // si es string o enum
  }

  return this.http.get<ApiResponse<Transaction[]>>(`${this.apiUrl}/history`, { params });
}

  downloadReceipt(transactionId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${transactionId}/receipt`, {
      responseType: 'blob'
    });
  }
}

