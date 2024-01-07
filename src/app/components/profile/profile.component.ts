import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  file64?: string | null | ArrayBuffer
  file?: File
  user = new User()

  formUser = new FormGroup({
    id: new FormControl(null),
    username: new FormControl(''),
    currentPassword: new FormControl(null),
    password: new FormControl(null),
    confirmPassword: new FormControl(null)
  })

  constructor(private tokenService: TokenService,
    private service: ApiService,
    private utils: UtilsService) {
    this.formUser.controls.confirmPassword.addValidators([Password.checkNew(this.formUser.controls.password), Password.checkOld(this.formUser.controls.currentPassword)])
    this.formUser.controls.password.addValidators(Password.checkOld(this.formUser.controls.currentPassword))
  }


  ngOnInit(): void {   
    this.service.search<User>('user', this.tokenService.getUser(),
      MatchMode.ALL, StringMatcher.CONTAINING, null, null).subscribe((dtos: User[]) => {
        this.utils.populate(dtos[0], this.formUser)
        this.file64 = `htts://localhost:8081/file/load/${dtos[0].avatarFile}`
      })
  }

  submit() {
    console.log(this.file);
    

  }

  setAvatar(event: any) {
    let reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.file64 = e.target?.result
    }
    reader.readAsDataURL(event.target.files[0])

    this.file = event.target.files[0]
  }
}
