import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BeneficiaryService } from '../../../../core/services/beneficiary.service';
import { Currency } from '@core/models/currency.model';
import { CustomValidators } from '../../../../core/validators/custom-validators';
import {
  LoadingController,
  AlertController,
  ToastController
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-beneficiary',
  templateUrl: './new-beneficiary.page.html',
  styleUrls: ['./new-beneficiary.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NewBeneficiaryPage implements OnInit {
    beneficiaryForm!: FormGroup;
    isLoading = false;


  banks = [
    'Banco de Costa Rica',
    'BAC San José',
    'Banco Nacional',
    'Banco Popular',
    'Scotiabank',
    'Banco Davivienda',
    'LAFISE',
    'Promerica',
    'Otro'
  ];

  countries = [
    { code: 'CR', name: 'Costa Rica' },
    { code: 'US', name: 'Estados Unidos' },
    { code: 'PA', name: 'Panamá' },
    { code: 'NI', name: 'Nicaragua' },
    { code: 'GT', name: 'Guatemala' },
    { code: 'SV', name: 'El Salvador' },
    { code: 'HN', name: 'Honduras' }
  ];

  currencies = [
    { value: Currency.CRC, label: 'Colones (CRC)' },
    { value: Currency.USD, label: 'Dólares (USD)' }
  ];

  constructor(
    private fb: FormBuilder,
    private beneficiaryService: BeneficiaryService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.beneficiaryForm = this.fb.group({
      alias: [
        '', 
        [
          Validators.required, 
          CustomValidators.aliasLength()
        ]
      ],
      bankName: ['', Validators.required],
      currency: [Currency.CRC, Validators.required],
      accountNumber: [
        '', 
        [
          Validators.required, 
          CustomValidators.accountNumber()
        ]
      ],
      country: ['CR', Validators.required]
    });
  }

  async onSubmit() {
  if (this.beneficiaryForm.invalid) {
    this.markFormGroupTouched(this.beneficiaryForm);
    return;
  }

  const loading = await this.loadingController.create({
    message: 'Registrando beneficiario...',
    spinner: 'crescent'
  });

  await loading.present();
  this.isLoading = true;

  try {
    const beneficiaryData = this.beneficiaryForm.value;

    this.beneficiaryService.createBeneficiary(beneficiaryData).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isLoading = false;

        const toast = await this.toastController.create({
          message: 'Beneficiario registrado exitosamente. Debe confirmarlo antes de usarlo.',
          duration: 3000,
          color: 'success',
          position: 'top'
        });
        await toast.present();

        this.router.navigate(['/client/beneficiaries']);
      },
      error: async (error) => {
        await loading.dismiss();
        this.isLoading = false;
        this.showError(error.message || 'Error al registrar beneficiario');
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

  getFieldError(fieldName: string): string {
    const control = this.beneficiaryForm.get(fieldName);
    if (!control?.touched) return '';

    if (control.hasError('required')) return 'Este campo es requerido';
    if (control.hasError('aliasLength')) return 'El alias debe tener entre 3 y 30 caracteres';
    if (control.hasError('accountNumber')) return 'Número de cuenta inválido (12-20 dígitos)';

    return '';
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
    this.router.navigate(['/client/beneficiaries']);
  }
}