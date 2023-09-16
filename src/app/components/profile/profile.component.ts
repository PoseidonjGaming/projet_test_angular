import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Credential } from 'src/app/models/credential.model';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/service/api.service';
import { TokenService } from 'src/app/service/token/token.service';
import { Password } from 'src/app/validators/passwordValidator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  formUser = new FormGroup({
    username: new FormControl(),
    currentPassword: new FormControl(null),
    password: new FormControl(null),
    confirmPassword: new FormControl(null)
  })

  constructor(private tokenService: TokenService, private service: ApiService<User>) { }


  ngOnInit(): void {
    this.service.search('user', this.tokenService.getClaims().sub).subscribe((dtos: User[]) => {
      this.formUser.controls.username.setValue(dtos[0].username)
    })
  }

  submit() {
    console.log(this.formUser.valid);

  }

  errors(ctrl: FormControl): string[] {
    return ctrl.errors ? Object.keys(ctrl.errors).map(err => ctrl.getError(err)).filter(err => err != null) : [];
  }
}
