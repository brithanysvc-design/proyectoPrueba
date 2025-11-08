import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Beneficiary, BeneficiaryStatus, Bank } from '../models/beneficiary.model';
import { ApiResponse } from '../models/api-response.model';

export interface CreateBeneficiaryDto {
  name: string;
  alias?: string;
  email?: string;
  phone?: string;
  bankId: string;
  accountType: 'SAVINGS' | 'CHECKING';
  accountNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {
  private apiUrl = `${environment.apiUrl}/beneficiaries`;
  private banksUrl = `${environment.apiUrl}/banks`;

  constructor(private http: HttpClient) { }

  private handleApiResponse<T>(response: ApiResponse<T>): T {
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error en la operación');
    }
    return response.data;
  }

  // ✅ Arreglado: devuelve directamente Beneficiary[]
  getBeneficiaries(): Observable<Beneficiary[]> {
    return this.http.get<ApiResponse<Beneficiary[]>>(this.apiUrl).pipe(
      map(response => this.handleApiResponse(response)), // extrae solo el array
      catchError(error => {
        console.error('Error fetching beneficiaries:', error);
        return throwError(() => new Error('No se pudieron cargar los beneficiarios'));
      })
    );
  }

  getBeneficiary(id: string): Observable<Beneficiary> {
    return this.http.get<ApiResponse<Beneficiary>>(`${this.apiUrl}/${id}`).pipe(
      map(response => this.handleApiResponse(response)),
      catchError(error => {
        console.error(`Error fetching beneficiary ${id}:`, error);
        return throwError(() => new Error('No se pudo cargar el beneficiario'));
      })
    );
  }

  createBeneficiary(beneficiary: CreateBeneficiaryDto): Observable<Beneficiary> {
    return this.http.post<ApiResponse<Beneficiary>>(this.apiUrl, beneficiary).pipe(
      map(response => this.handleApiResponse(response)),
      catchError(error => {
        console.error('Error creating beneficiary:', error);
        return throwError(() => new Error('No se pudo crear el beneficiario'));
      })
    );
  }

  updateBeneficiary(id: string, beneficiary: Partial<CreateBeneficiaryDto>): Observable<Beneficiary> {
    return this.http.patch<ApiResponse<Beneficiary>>(`${this.apiUrl}/${id}`, beneficiary).pipe(
      map(response => this.handleApiResponse(response)),
      catchError(error => {
        console.error(`Error updating beneficiary ${id}:`, error);
        return throwError(() => new Error('No se pudo actualizar el beneficiario'));
      })
    );
  }

  deleteBeneficiary(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(response => this.handleApiResponse(response)),
      catchError(error => {
        console.error(`Error deleting beneficiary ${id}:`, error);
        return throwError(() => new Error('No se pudo eliminar el beneficiario'));
      })
    );
  }

  updateBeneficiaryStatus(id: string, status: BeneficiaryStatus): Observable<Beneficiary> {
    return this.http.patch<ApiResponse<Beneficiary>>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      map(response => this.handleApiResponse(response)),
      catchError(error => {
        console.error(`Error updating beneficiary status ${id}:`, error);
        return throwError(() => new Error('No se pudo actualizar el estado del beneficiario'));
      })
    );
  }

  getBanks(): Observable<Bank[]> {
    return this.http.get<ApiResponse<Bank[]>>(this.banksUrl).pipe(
      map(response => this.handleApiResponse(response)),
      catchError(error => {
        console.error('Error fetching banks:', error);
        return throwError(() => new Error('No se pudieron cargar los bancos'));
      })
    );
  }
}