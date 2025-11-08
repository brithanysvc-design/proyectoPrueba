import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AccountService } from '@core/services/account.service';
import { BeneficiaryService } from '@core/services/beneficiary.service';
import { TransactionService } from '@core/services/transaction.service';
import { Account, AccountStatus } from '@core/models/account.model';
import { Beneficiary, BeneficiaryStatus } from '@core/models/beneficiary.model';
import { TransferPreview } from '@core/models/transfer-preview.model';
import { CustomValidators } from '@core/validators/custom-validators';
import { ApiResponse } from '@core/models/api-response.model';
import { IonicModule, LoadingController, AlertController, ModalController, ToastController } from '@ionic/angular';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonButton, IonIcon, IonList, IonItem, IonLabel, IonSelect, IonSelectOption,
  IonSegment, IonSegmentButton, IonInput, IonTextarea, IonToggle,
  IonDatetimeButton, IonModal, IonDatetime, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-new-transfer',
  templateUrl: './new-transfer.page.html',
  styleUrls: ['./new-transfer.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonInput,
    IonTextarea,
    IonToggle,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class NewTransferPage implements OnInit {
  transferForm!: FormGroup;
  accounts: Account[] = [];
  ownAccounts: Account[] = [];
  beneficiaries: Beneficiary[] = [];
  transferPreview: TransferPreview | null = null;
  isLoading = false;
  showPreview = false;

  destinationType: 'own' | 'third' = 'own';
  scheduleTransfer = false;
  minDate: string;
  maxDate: string;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private beneficiaryService: BeneficiaryService,
    private transactionService: TransactionService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private modalController: ModalController,
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
    this.transferForm = this.fb.group({
      sourceAccountId: ['', Validators.required],
      destinationAccountId: [''],
      beneficiaryId: [''],
      amount: ['', [Validators.required, CustomValidators.positiveAmount()]],
      description: ['', Validators.maxLength(200)],
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
      await this.loadAccounts();
      await this.loadBeneficiaries();
      await loading.dismiss();
    } catch (error: any) {
      await loading.dismiss();
      this.showError(error.message || 'Error al cargar la información');
    }
  }

  async loadAccounts() {
    return new Promise((resolve, reject) => {
      this.accountService.getAccounts({ status: AccountStatus.Active })
        .subscribe({
          next: (res: ApiResponse<Account[]>) => {
            if (res.success && res.data) {
              this.accounts = res.data;
              resolve(true);
            } else {
              reject(new Error('Error al cargar cuentas'));
            }
          },
          error: (error) => reject(error)
        });
    });
  }

  async loadBeneficiaries() {
  return new Promise((resolve, reject) => {
    this.beneficiaryService.getBeneficiaries()
      .subscribe({
        next: (beneficiaries: Beneficiary[]) => { // ← aquí ya es Beneficiary[]
          this.beneficiaries = beneficiaries.filter(
            b => b.status === BeneficiaryStatus.ACTIVE
          );
          resolve(true);
        },
        error: (error) => reject(error)
      });
  });
}

  // -------------------------------
  // Métodos requeridos por el template
  // -------------------------------

  onSourceAccountChange() {
    // TODO: lógica al cambiar cuenta origen
  }

  getAccountDisplay(account: Account) {
    return `${account.type || ''} *${account.accountNumber?.slice(-4) || ''}`;
  }

  formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency
    }).format(amount);
  }

  onDestinationTypeChange(value: 'own' | 'third') {
    this.destinationType = value;
  }

  toggleSchedule() {
    this.scheduleTransfer = !this.scheduleTransfer;
  }

  previewTransfer() {
    // TODO: calcular transferencia y mostrar preview
    this.showPreview = true;
  }

  executeTransfer() {
    // TODO: ejecutar o programar transferencia
  }

  getBeneficiaryDisplay(beneficiary: Beneficiary) {
    return `${beneficiary.alias} - ${beneficiary.bankName} (${beneficiary.currency})`;
  }

  // -------------------------------
  // Utilidades
  // -------------------------------

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
