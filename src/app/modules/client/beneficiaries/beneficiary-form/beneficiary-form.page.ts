import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { BeneficiaryService } from '../../../../core/services/beneficiary.service';
import { CustomValidators } from '../../../../core/validators/custom-validators';

interface Bank {
  id: string;
  name: string;
}

@Component({
  selector: 'app-beneficiary-form',
  templateUrl: './beneficiary-form.page.html',
  styleUrls: ['./beneficiary-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class BeneficiaryFormPage implements OnInit {
  beneficiaryForm!: FormGroup;
  isEditing = false;
  isSubmitting = false;
  beneficiaryId?: string;

  banks: Bank[] = [
    { id: 'bank1', name: 'Banco 1' },
    { id: 'bank2', name: 'Banco 2' },
    { id: 'bank3', name: 'Banco 3' },
  ];

 
  constructor(
    private formBuilder: FormBuilder,
    private beneficiaryService: BeneficiaryService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.beneficiaryForm = this.createForm();
  }

  ngOnInit() {
    this.beneficiaryId = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (this.beneficiaryId) {
      this.isEditing = true;
      this.loadBeneficiary();
    }
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      alias: [''],
      email: ['', [Validators.email]],
      phone: ['', [CustomValidators.phoneNumber]],
      bankId: ['', [Validators.required]],
      accountType: ['', [Validators.required]],
      accountNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
    });
  }

  async loadBeneficiary() {
    if (!this.beneficiaryId) return;

    const loading = await this.loadingController.create({
      message: 'Cargando beneficiario...'
    });
    await loading.present();

    try {
      const beneficiary = await this.beneficiaryService.getBeneficiary(this.beneficiaryId).toPromise();
      if (beneficiary) {
        this.beneficiaryForm.patchValue(beneficiary);
      }
    } catch (error) {
      console.error('Error loading beneficiary:', error);
      this.showErrorToast('No se pudo cargar el beneficiario');
      this.router.navigate(['/client/beneficiaries']);
    } finally {
      await loading.dismiss();
    }
  }

  async onSubmit() {
    if (this.beneficiaryForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingController.create({
      message: this.isEditing ? 'Actualizando beneficiario...' : 'Agregando beneficiario...'
    });
    await loading.present();

    try {
      const beneficiaryData = this.beneficiaryForm.value;
      
      if (this.isEditing && this.beneficiaryId) {
        await this.beneficiaryService.updateBeneficiary(this.beneficiaryId, beneficiaryData).toPromise();
      } else {
        await this.beneficiaryService.createBeneficiary(beneficiaryData).toPromise();
      }

      this.showSuccessToast(
        this.isEditing ? 'Beneficiario actualizado correctamente' : 'Beneficiario agregado correctamente'
      );
      this.router.navigate(['/client/beneficiaries']);
    } catch (error) {
      console.error('Error saving beneficiary:', error);
      this.showErrorToast(
        this.isEditing ? 'No se pudo actualizar el beneficiario' : 'No se pudo agregar el beneficiario'
      );
    } finally {
      this.isSubmitting = false;
      await loading.dismiss();
    }
  }

  showError(controlName: string): boolean {
    const control = this.beneficiaryForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.beneficiaryForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control.hasError('email')) {
      return 'Ingresa un correo electrónico válido';
    }
    if (control.hasError('minlength')) {
      return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control.hasError('maxlength')) {
      return `No debe exceder ${control.errors?.['maxlength'].requiredLength} caracteres`;
    }
    if (control.hasError('phoneNumber')) {
      return 'Ingresa un número de teléfono válido';
    }

    return 'Campo inválido';
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }

  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}