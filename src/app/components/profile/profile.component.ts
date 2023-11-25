import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/service/api.service';
import { TokenService } from 'src/app/service/token/token.service';
import { UtilsService } from 'src/app/service/utils/utils.service';
import { Password } from 'src/app/validators/passwordValidator.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

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
    this.formUser.controls.confirmPassword.addValidators(Password.checkNew(this.formUser.controls.password))
    this.formUser.controls.password.addValidators(Password.checkOld(this.formUser.controls.currentPassword))
  }


  ngOnInit(): void {
    
    this.service.search<User>('user', { username: this.tokenService.getClaims().sub }).subscribe((dtos: User[]) => {
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
