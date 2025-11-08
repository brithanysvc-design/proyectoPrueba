export interface Client {
  id: string;
  identification: string;
  fullName: string;
  phone: string;
  email: string;
  userId?: string;
  managerId?: string;
}