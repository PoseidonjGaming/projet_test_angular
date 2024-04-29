import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MenuComponent } from '../menu/menu.component';
import { ApiService } from '../../service/api/api.service';
import { UtilsService } from '../../service/utils/utils.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CredentialService } from '../../service/api/credential/credential.service';
import { TokenService } from '../../service/api/token/token.service';
import { mergeMap } from 'rxjs';
import { Credential } from '../../models/credential.model';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [MenuComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  form = new FormGroup({
    username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  })

  constructor(private service: CredentialService,
    private utilsService: UtilsService,
    private tokenService: TokenService,
    private router: Router) { }

  submit() {
    if (this.form.valid) {
      this.service.registrate(this.utilsService.updateValues(new User(), this.form)).pipe(
        mergeMap(() => this.service.authenticate(this.form.getRawValue()))
      ).subscribe((token: any) => {
        this.tokenService.setToken(token.token)
        this.tokenService.nextRole()
        this.router.navigate(['/'])
      })
    }
  }
}
