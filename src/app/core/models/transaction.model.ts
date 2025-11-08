import { Currency } from './currency.model';

export interface Transaction {
  id: string;
  type: TransactionType;
  sourceAccountId: string;
  destinationAccountId?: string;
  beneficiaryId?: string;
  amount: number;
  currency: Currency;
  commission: number;
  totalAmount: number;
  status: TransactionStatus;
  description?: string;
  scheduledDate?: Date;
  executedDate?: Date;
  referenceNumber: string;
  idempotencyKey?: string;
  createdAt: Date;
}

export enum TransactionType {
  Transfer = 'Transferencia',
  Payment = 'Pago de servicio'
}

export enum TransactionStatus {
  PendingApproval = 'Pendiente de aprobación',
  Scheduled = 'Programada',
  Successful = 'Exitosa',
  Failed = 'Fallida',
  Cancelled = 'Cancelada',
  Rejected = 'Rechazada'
}