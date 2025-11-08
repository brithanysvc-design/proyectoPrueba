import { Currency } from './currency.model';
export { Currency }; // 🔹 exportarlo para que otros módulos puedan usarlo

// src/app/core/models/account.model.ts
export interface Account {
  id: string;
  accountNumber: string;
  type: AccountType;
  currency: Currency;
  balance: number;
  status: AccountStatus;
  clientId: string;
  createdAt: Date;
}

export enum AccountType {
  Savings = 'Ahorros',
  Current = 'Corriente',
  Investment = 'Inversión',
  FixedTerm = 'Plazo fijo'
}

export enum AccountStatus {
  Active = 'Activa',
  Blocked = 'Bloqueada',
  Closed = 'Cerrada'
}
