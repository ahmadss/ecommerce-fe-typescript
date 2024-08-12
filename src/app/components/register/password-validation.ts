import { AbstractControl, ValidatorFn } from '@angular/forms';

export class PasswordValidation {
  static MatchPassword(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { mustMatch: true };
    }
    return null;
  }
}
