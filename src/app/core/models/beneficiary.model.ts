export interface Beneficiary {
  id: string;
  name: string;
  alias?: string;
  email?: string;
  phone?: string;
  bankId: string;
  bankName: string;
  accountType: 'SAVINGS' | 'CHECKING';
  accountNumber: string;
  status: BeneficiaryStatus;
  createdAt: Date;
 currency: string;
}

export enum BeneficiaryStatus {
  ACTIVE = 'Activo',
  INACTIVE = 'Inactivo',
  PENDING = 'Pendiente'
}

export interface Bank {
  id: string;
  name: string;
  code: string;
  country: string;
  status: 'ACTIVE ' | 'INACTIVE';
}