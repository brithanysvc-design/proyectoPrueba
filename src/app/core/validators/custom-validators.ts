import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // Validador de contraseña según RF-A1
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasMinLength = value.length >= 8;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const passwordValid = hasMinLength && hasUpperCase && hasNumber && hasSymbol;

      return !passwordValid ? {
        passwordStrength: {
          hasMinLength,
          hasUpperCase,
          hasNumber,
          hasSymbol
        }
      } : null;
    };
  }

  // Validador de alias para beneficiarios (RF-C1)
  static aliasLength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      const isValid = value.length >= 3 && value.length <= 30;
      return !isValid ? { aliasLength: true } : null;
    };
  }

  // Validador de número de cuenta (RF-C1)
  static accountNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      const length = value.toString().length;
      const isValid = length >= 12 && length <= 20 && /^\d+$/.test(value);
      
      return !isValid ? { accountNumber: true } : null;
    };
  }

  // Validador de número de teléfono
  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      // Formato: +código de país seguido de 6-15 dígitos
      // Ejemplo: +1234567890
      const phonePattern = /^\+[1-9]\d{5,14}$/;
      
      return phonePattern.test(value) ? null : { phoneNumber: true };
    };
  }

  // Validador de monto positivo
  static positiveAmount(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (value === null || value === undefined) {
        return null;
      }

      return value > 0 ? null : { positiveAmount: true };
    };
  }

  // Validador de cédula costarricense
  static costaRicanId(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      // Formato básico: 9 dígitos
      const isValid = /^\d{9}$/.test(value);
      return !isValid ? { costaRicanId: true } : null;
    };
  }

  // Validador de correo electrónico
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      // RFC 5322 email pattern
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailPattern.test(value) ? null : { email: true };
    };
  }
}