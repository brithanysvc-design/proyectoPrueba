import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IonicModule, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { CustomValidators } from '../../../core/validators/custom-validators';
import { UserRole } from '../../../core/models/user.model';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    IonicModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton
  ]
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  userRoles = [
    { value: UserRole.Client, label: 'Cliente' },
    { value: UserRole.Manager, label: 'Gestor' },
    { value: UserRole.Admin, label: 'Administrador' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.passwordStrength()]],
      confirmPassword: ['', [Validators.required]],
      role: [UserRole.Client, [Validators.required]],
      identification: [''],
      phone: ['', [Validators.pattern(/^\d{8}$/)]]
    }, {
      validators: this.passwordMatchValidator
    });

    // Hacer requerida la identificación si el rol es Cliente
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      const identificationControl = this.registerForm.get('identification');
      if (role === UserRole.Client) {
        identificationControl?.setValidators([
          Validators.required,
          CustomValidators.costaRicanId()
        ]);
      } else {
        identificationControl?.clearValidators();
      }
      identificationControl?.updateValueAndValidity();
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Registrando usuario...',
      spinner: 'crescent'
    });

    await loading.present();
    this.isLoading = true;

    try {
      const { confirmPassword, ...registerData } = this.registerForm.value;
      
      this.authService.register(registerData).subscribe({
        next: async (response) => {
          await loading.dismiss();
          this.isLoading = false;

          if (response.success) {
            const alert = await this.alertController.create({
              header: 'Registro Exitoso',
              message: 'El usuario ha sido registrado correctamente. Por favor inicie sesión.',
              buttons: [{
                text: 'OK',
                handler: () => {
                  this.router.navigate(['/auth/login']);
                }
              }]
            });
            await alert.present();
          } else {
            this.showError(response.message || 'Error al registrar usuario');
          }
        },
        error: async (error) => {
          await loading.dismiss();
          this.isLoading = false;
          this.showError(error.message || 'Error al registrar usuario');
        }
      });
    } catch (error: any) {
      await loading.dismiss();
      this.isLoading = false;
      this.showError(error.message || 'Error inesperado');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getPasswordStrengthErrors(): string[] {
    const control = this.registerForm.get('password');
    const errors = control?.errors?.['passwordStrength'];
    const messages: string[] = [];

    if (errors) {
      if (!errors.hasMinLength) messages.push('Mínimo 8 caracteres');
      if (!errors.hasUpperCase) messages.push('Al menos 1 mayúscula');
      if (!errors.hasNumber) messages.push('Al menos 1 número');
      if (!errors.hasSymbol) messages.push('Al menos 1 símbolo');
    }

    return messages;
  }

  get formErrors() {
    return {
      fullName: this.getFieldError('fullName'),
      email: this.getFieldError('email'),
      password: this.getPasswordStrengthErrors(),
      confirmPassword: this.getFieldError('confirmPassword'),
      identification: this.getFieldError('identification'),
      phone: this.getFieldError('phone')
    };
  }

  getFieldError(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (!control?.touched) return '';

    if (control.hasError('required')) return `Este campo es requerido`;
    if (control.hasError('email')) return 'Correo electrónico inválido';
    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control.hasError('pattern') && fieldName === 'phone') {
      return 'El teléfono debe tener 8 dígitos';
    }
    if (control.hasError('costaRicanId')) {
      return 'Cédula inválida (debe tener 9 dígitos)';
    }
    
    return '';
  }

  get passwordMismatch(): boolean {
    return this.registerForm.hasError('passwordMismatch') && 
           this.registerForm.get('confirmPassword')?.touched || false;
  }
}