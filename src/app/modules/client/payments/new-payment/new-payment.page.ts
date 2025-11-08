import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, AlertController, ToastController } from '@ionic/angular';

import { PaymentService } from '../../../../core/services/payment.service';
import { AccountService } from '../../../../core/services/account.service';

import { ServiceProvider } from '../../../../core/models/payment.model';
import { Account, AccountStatus } from '../../../../core/models/account.model';
import { CustomValidators } from '../../../../core/validators/custom-validators';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.page.html',
  styleUrls: ['./new-payment.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class NewPaymentPage implements OnInit {
  paymentForm!: FormGroup;
  accounts: Account[] = [];
  serviceProviders: ServiceProvider[] = [];
  filteredProviders: ServiceProvider[] = [];
  selectedProvider: ServiceProvider | null = null;
  isLoading = false;
  schedulePayment = false;
  minDate: string;
  maxDate: string;

  // Categorías de servicios
  categories = [
    { value: 'all', label: 'Todos' },
    { value: 'Electricidad', label: 'Electricidad' },
    { value: 'Agua', label: 'Agua' },
    { value: 'Telefonía', label: 'Telefonía' },
    { value: 'Internet', label: 'Internet' },
    { value: 'Cable', label: 'Cable' },
    { value: 'Seguros', label: 'Seguros' },
    { value: 'Educación', label: 'Educación' }
  ];

  selectedCategory = 'all';

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private accountService: AccountService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    const today = new Date();
    const maxScheduleDate = new Date();
    maxScheduleDate.setDate(today.getDate() + 90);
    
    this.minDate = today.toISOString();
    this.maxDate = maxScheduleDate.toISOString();
  }

  ngOnInit() {
    this.initForm();
    this.loadData();
  }

  initForm() {
    this.paymentForm = this.fb.group({
      providerId: ['', Validators.required],
      contractNumber: ['', [Validators.required, Validators.minLength(8)]],
      amount: ['', [Validators.required, CustomValidators.positiveAmount()]],
      sourceAccountId: ['', Validators.required],
      scheduledDate: ['']
    });
  }

  async loadData() {
    const loading = await this.loadingController.create({
      message: 'Cargando información...',
      spinner: 'crescent'
    });

    await loading.present();

    try {
      await Promise.all([
        this.loadAccounts(),
        this.loadServiceProviders()
      ]);

      await loading.dismiss();
    } catch (error: any) {
      await loading.dismiss();
      this.showError(error.message || 'Error al cargar la información');
    }
  }

  async loadAccounts() {
    return new Promise((resolve, reject) => {
      this.accountService.getAccounts({ status: AccountStatus.Active }).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.accounts = response.data;
            resolve(true);
          } else {
            reject(new Error('Error al cargar cuentas'));
          }
        },
        error: (error) => reject(error)
      });
    });
  }

  async loadServiceProviders() {
    return new Promise((resolve, reject) => {
      this.paymentService.getServiceProviders().subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.serviceProviders = response.data.filter(p => p.isActive);
            this.filteredProviders = this.serviceProviders;
            resolve(true);
          } else {
            reject(new Error('Error al cargar proveedores'));
          }
        },
        error: (error) => reject(error)
      });
    });
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.target.value;
    this.filterProviders();
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredProviders = this.serviceProviders.filter(provider => {
      const matchesCategory = this.selectedCategory === 'all' || 
        provider.category === this.selectedCategory;
      
      const matchesSearch = !searchTerm || 
        provider.name.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }

  filterProviders() {
    if (this.selectedCategory === 'all') {
      this.filteredProviders = this.serviceProviders;
    } else {
      this.filteredProviders = this.serviceProviders.filter(
        p => p.category === this.selectedCategory
      );
    }
  }

  onProviderChange() {
    const providerId = this.paymentForm.get('providerId')?.value;
    this.selectedProvider = this.serviceProviders.find(p => p.id === providerId) || null;
    
    if (this.selectedProvider) {
      // Actualizar validadores del número de contrato según el proveedor
      const contractControl = this.paymentForm.get('contractNumber');
      contractControl?.setValidators([
        Validators.required,
        Validators.minLength(this.selectedProvider.minLength),
        Validators.maxLength(this.selectedProvider.maxLength),
        Validators.pattern(this.selectedProvider.contractValidationRule)
      ]);
      contractControl?.updateValueAndValidity();
    }
  }

  toggleSchedule() {
    this.schedulePayment = !this.schedulePayment;
    if (!this.schedulePayment) {
      this.paymentForm.get('scheduledDate')?.setValue('');
    }
  }

  async onSubmit() {
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm);
      return;
    }

    if (this.schedulePayment && !this.paymentForm.get('scheduledDate')?.value) {
      this.showError('Debe seleccionar una fecha para el pago programado');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Pago',
      message: `¿Está seguro que desea ${this.schedulePayment ? 'programar' : 'realizar'} este pago?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.processPayment();
          }
        }
      ]
    });

    await alert.present();
  }

  async processPayment() {
    const loading = await this.loadingController.create({
      message: 'Procesando pago...',
      spinner: 'crescent'
    });

    await loading.present();
    this.isLoading = true;

    try {
      const formValue = this.paymentForm.value;
      const paymentData = {
        providerId: formValue.providerId,
        contractNumber: formValue.contractNumber,
        amount: parseFloat(formValue.amount),
        sourceAccountId: formValue.sourceAccountId,
        scheduledDate: this.schedulePayment ? formValue.scheduledDate : undefined
      };

      const serviceCall = this.schedulePayment
        ? this.paymentService.schedulePayment(paymentData)
        : this.paymentService.executePayment(paymentData);

      serviceCall.subscribe({
        next: async (response) => {
          await loading.dismiss();
          this.isLoading = false;

          if (response.success && response.data) {
            const toast = await this.toastController.create({
              message: this.schedulePayment 
                ? 'Pago programado exitosamente' 
                : 'Pago realizado exitosamente',
              duration: 3000,
              color: 'success',
              position: 'top'
            });
            await toast.present();

            this.router.navigate(['/client/history']);
          } else {
            this.showError(response.message || 'Error al procesar el pago');
          }
        },
        error: async (error) => {
          await loading.dismiss();
          this.isLoading = false;
          this.showError(error.message || 'Error al procesar el pago');
        }
      });
    } catch (error: any) {
      await loading.dismiss();
      this.isLoading = false;
      this.showError(error.message || 'Error inesperado');
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getAccountDisplay(account: Account): string {
    return `${account.type} - *${account.accountNumber.slice(-4)} (${account.currency})`;
  }

  getContractNumberHelp(): string {
    if (!this.selectedProvider) return '';
    return `Debe tener entre ${this.selectedProvider.minLength} y ${this.selectedProvider.maxLength} dígitos`;
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: currency === 'CRC' ? 'CRC' : 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  cancel() {
    this.router.navigate(['/client/dashboard']);
  }
}