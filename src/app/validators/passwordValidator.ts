import { AbstractControl, ValidationErrors } from "@angular/forms";

export class Password {
    static checkNew() {
        return (control: AbstractControl): ValidationErrors | null => {

            let error = { notSame: 'Les nouveaux mots de passe ne correspondent pas' }
            let password = control.get('password')
            let confirmPassword = control.get('confirmPassword')
            if (password && confirmPassword) {
                if (password.value && confirmPassword.value) {
                    if (password.value !== confirmPassword.value) {
                        password.setErrors(error)
                        password.setErrors
                        return error
                    }
                    else {
                        password.setErrors(null)
                    }
                }
            }
            return null;
        }
    }


}