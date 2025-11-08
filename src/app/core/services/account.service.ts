import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, AccountType, Currency, AccountStatus } from '../models/account.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'https://your-api-url.com/api/accounts';

  constructor(private http: HttpClient) {}

  getAccounts(filters?: {
    clientId?: string;
    type?: AccountType;
    currency?: Currency;
    status?: AccountStatus;
  }): Observable<ApiResponse<Account[]>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof typeof filters];
        if (value) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Account[]>>(this.apiUrl, { params });
  }

  getAccountById(id: string): Observable<ApiResponse<Account>> {
    return this.http.get<ApiResponse<Account>>(`${this.apiUrl}/${id}`);
  }

  createAccount(account: Partial<Account>): Observable<ApiResponse<Account>> {
    return this.http.post<ApiResponse<Account>>(this.apiUrl, account);
  }

  updateAccountStatus(id: string, status: AccountStatus): Observable<ApiResponse<Account>> {
    return this.http.patch<ApiResponse<Account>>(`${this.apiUrl}/${id}/status`, { status });
  }

  closeAccount(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
