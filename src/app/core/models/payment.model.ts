// src/app/core/models/payment.model.ts
import { TransactionStatus } from './transaction.model';

export interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  contractValidationRule: string;
  minLength: number;
  maxLength: number;
  isActive: boolean;
}

export interface Payment {
  id: string;
  providerId: string;
  contractNumber: string;
  amount: number;
  sourceAccountId: string;
  status: TransactionStatus;
  referenceNumber: string;
  scheduledDate?: Date;
  executedDate?: Date;
  createdAt: Date;
}
