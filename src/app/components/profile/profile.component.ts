import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from '../../models/user.model';
import { ApiService } from '../../service/api/api.service';
import { TokenService } from '../../service/api/token/token.service';
import { UtilsService } from '../../service/utils/utils.service';
import { MatchMode } from '../../models/enum/MatchMode.model';
import { StringMatcher } from '../../models/enum/StringMatcher.model';
import { Password } from '../../validators/passwordValidator.validator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FileService } from '../../service/api/file/file.service';
import { CredentialService } from '../../service/api/credential/credential.service';
import { DisplayFileDialogComponent } from '../admin/generic/form/file/display-file-dialog/display-file-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MenuComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  file?: File
  private user: User = new User()

  formUser = new FormGroup({
    id: new FormControl(null),
    username: new FormControl(''),
    currentPassword: new FormControl(null),
    password: new FormControl(null),
    confirmPassword: new FormControl(null),
    avatarFile: new FormControl('')
  })

  constructor(private tokenService: TokenService,
    private service: ApiService,
    private credentialService: CredentialService,
    private fileService: FileService,
    private utils: UtilsService,
    private dialog: MatDialog) {
    this.formUser.controls.confirmPassword.addValidators([Password.checkNew(this.formUser.controls.password), Password.checkOld(this.formUser.controls.currentPassword)])
    this.formUser.controls.password.addValidators(Password.checkOld(this.formUser.controls.currentPassword))
  }


  ngOnInit(): void {
    this.service.search<User>('user', this.tokenService.getUser(),
      MatchMode.ALL, StringMatcher.CONTAINING, null, null).subscribe((dtos: User[]) => {
        this.utils.populate(dtos[0], this.formUser)
        this.user = dtos[0]
      })
  }

  submit() {
    if (this.formUser.valid) {
      const dto = this.utils.updateValues(new User(), this.formUser)
      dto['avatarFile'] = this.file?.name
      this.credentialService.updateAccount(dto as User).subscribe(() => { })
      this.fileService.upload(this.file!, 'user').subscribe(() => { })
    }
  }

  setAvatar(event: any) {
    this.file = event.target.files[0] as File
  }

  openPosterDialog() {
    this.dialog.open(DisplayFileDialogComponent, {
      data: this.file
    })
  }

  reset(form: FormGroupDirective) {
    form.resetForm(this.user)
  }
}
