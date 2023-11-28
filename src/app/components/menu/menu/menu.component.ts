import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Credential } from 'src/app/models/credential.model';
import { CredentialService } from 'src/app/service/credential/credential.service';
import { TokenService } from 'src/app/service/token/token.service';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private rolesAdmin = ['ROLE_super_admin']
  hide = true;
  isLogged: boolean = false
  username?: string

  formLogin = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(public dialog: MatDialog,
    private service: CredentialService,
    private tokenService: TokenService,
    private router: Router,
    private jwt: JwtHelperService) { }


  ngOnInit(): void {
    this.tokenService.subscribeRole().subscribe((d) => {
      this.isLogged = this.tokenService.isExist() && !this.jwt.isTokenExpired(this.tokenService.getToken());
    })
    this.tokenService.nextRole()
    if (this.tokenService.isExist()) {
      this.username = this.tokenService.getClaims().sub
    }
  }

  openDialogImport() {
    this.dialog.open(ImportDialogComponent);
  }
  openDialogExport() {
    this.dialog.open(ExportDialogComponent);
  }

  submit() {
    if (this.formLogin.valid) {
      this.service.authenticate(this.formLogin.value as Credential).subscribe((token: any) => {
        this.tokenService.setToken(token.token)
        this.username = this.tokenService.getClaims().sub
        this.tokenService.nextRole()
      })
    }
  }

  logout() {
    this.tokenService.logout();
    this.tokenService.nextRole()
    this.router.navigate(['/'])
  }
}
