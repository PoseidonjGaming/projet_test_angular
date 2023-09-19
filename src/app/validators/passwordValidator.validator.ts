import { AbstractControl, ValidationErrors } from '@angular/forms';

export class Password {
    static checkNew(password: AbstractControl) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (password.value && control.value) {
                if (password.value !== control.value) {
                    return { notSame: 'Les nouveaux mots de passe ne correspondent pas' }
                }
            }

            return null;
        }
    }

    static checkOld(currentPassword: AbstractControl) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (currentPassword.value && control.value) {
                if (currentPassword.value === control.value) {
                    return { same: 'Le nouveau mot de passe est le même que l\'ancien' }
                }
            }
            return null;
        }
    }


}