import { Account } from './account.model';
import { Beneficiary } from './beneficiary.model';

export interface TransferPreview {
  sourceAccount: Account;
  destinationAccount: Account | Beneficiary;
  amount: number;
  commission: number;
  totalAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  availableDailyLimit: number;
  requiresApproval: boolean;
}