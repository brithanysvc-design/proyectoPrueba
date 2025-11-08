import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { IonicModule, LoadingController, AlertController, ModalController } from '@ionic/angular';

import { TransactionService } from '../../../../core/services/transaction.service';
import { Transaction, TransactionType, TransactionStatus } from '../../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.page.html',
  styleUrls: ['./transaction-history.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class TransactionHistoryPage implements OnInit {

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  filterForm!: FormGroup;
  isLoading = true;
  
  // Opciones de filtro
  transactionTypes = [
    { value: 'all', label: 'Todos' },
    { value: TransactionType.Transfer, label: 'Transferencias' },
    { value: TransactionType.Payment, label: 'Pagos' }
  ];

  transactionStatuses = [
    { value: 'all', label: 'Todos' },
    { value: TransactionStatus.Successful, label: 'Exitosas' },
    { value: TransactionStatus.PendingApproval, label: 'Pendientes' },
    { value: TransactionStatus.Scheduled, label: 'Programadas' },
    { value: TransactionStatus.Failed, label: 'Fallidas' },
    { value: TransactionStatus.Cancelled, label: 'Canceladas' },
    { value: TransactionStatus.Rejected, label: 'Rechazadas' }
  ];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initFilterForm();
    this.loadTransactions();
  }

  initFilterForm() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // Último mes por defecto

    this.filterForm = this.fb.group({
      startDate: [startDate.toISOString()],
      endDate: [endDate.toISOString()],
      type: ['all'],
      status: ['all']
    });

    // Aplicar filtros cuando cambien
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  async loadTransactions() {
    const loading = await this.loadingController.create({
      message: 'Cargando transacciones...',
      spinner: 'crescent'
    });

    await loading.present();

    const filters = this.getFilters();

    this.transactionService.getTransactionHistory(filters).subscribe({
      next: async (response) => {
        this.isLoading = false;
        await loading.dismiss();

        if (response.success && response.data) {
          this.transactions = response.data;
          this.filteredTransactions = response.data;
        } else {
          this.showError('Error al cargar transacciones');
        }
      },
      error: async (error) => {
        this.isLoading = false;
        await loading.dismiss();
        this.showError(error.message || 'Error al cargar transacciones');
      }
    });
  }

  getFilters() {
    const formValue = this.filterForm.value;
    return {
      startDate: new Date(formValue.startDate),
      endDate: new Date(formValue.endDate),
      type: formValue.type !== 'all' ? formValue.type : undefined,
      status: formValue.status !== 'all' ? formValue.status : undefined
    };
  }

  applyFilters() {
    const formValue = this.filterForm.value;
    
    this.filteredTransactions = this.transactions.filter(transaction => {
      const matchesType = formValue.type === 'all' || transaction.type === formValue.type;
      const matchesStatus = formValue.status === 'all' || transaction.status === formValue.status;
      
      return matchesType && matchesStatus;
    });
  }

  async downloadReceipt(transaction: Transaction) {
    const loading = await this.loadingController.create({
      message: 'Descargando comprobante...',
      spinner: 'crescent'
    });

    await loading.present();

    this.transactionService.downloadReceipt(transaction.id).subscribe({
      next: async (blob) => {
        await loading.dismiss();
        
        // Crear un link temporal y descargarlo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `comprobante-${transaction.referenceNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: async (error) => {
        await loading.dismiss();
        this.showError('Error al descargar comprobante');
      }
    });
  }

  async generateStatement() {
    const alert = await this.alertController.create({
      header: 'Generar Extracto',
      message: 'Seleccione el formato del extracto',
      buttons: [
        {
          text: 'PDF',
          handler: () => {
            this.downloadStatement('pdf');
          }
        },
        {
          text: 'CSV',
          handler: () => {
            this.downloadStatement('csv');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async downloadStatement(format: 'pdf' | 'csv') {
    const loading = await this.loadingController.create({
      message: 'Generando extracto...',
      spinner: 'crescent'
    });

    await loading.present();

    // Aquí implementarías la llamada al servicio para generar el extracto
    setTimeout(async () => {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Éxito',
        message: `Extracto en formato ${format.toUpperCase()} descargado exitosamente`,
        buttons: ['OK']
      });
      await alert.present();
    }, 2000);
  }

  getTransactionIcon(type: TransactionType): string {
    return type === TransactionType.Transfer ? 'swap-horizontal' : 'card';
  }

  getTransactionColor(type: TransactionType): string {
    return type === TransactionType.Transfer ? 'primary' : 'success';
  }

  getStatusColor(status: TransactionStatus): string {
    const colors: { [key: string]: string } = {
      [TransactionStatus.Successful]: 'success',
      [TransactionStatus.PendingApproval]: 'warning',
      [TransactionStatus.Scheduled]: 'tertiary',
      [TransactionStatus.Failed]: 'danger',
      [TransactionStatus.Cancelled]: 'medium',
      [TransactionStatus.Rejected]: 'danger'
    };
    return colors[status] || 'medium';
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: currency === 'CRC' ? 'CRC' : 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async handleRefresh(event: any) {
    await this.loadTransactions();
    event.target.complete();
  }
}