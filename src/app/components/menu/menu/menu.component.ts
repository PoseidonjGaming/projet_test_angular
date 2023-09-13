import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { CredentialService } from 'src/app/service/credential/credential.service';
import { Credential } from 'src/app/models/credential.model';
import { TokenService } from 'src/app/service/token/token.service';
import jwtDecode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private rolesAdmin=['ROLE_super_admin']
  hide = true;
  isLogged: boolean = false

  formLogin = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(public dialog: MatDialog,
    private service: CredentialService,
    private tokenService: TokenService,
    private jwt: JwtHelperService) { }


  ngOnInit(): void {
    this.tokenService.subscribeRole().subscribe((d)=>{
      this.isLogged = this.tokenService.isExist() && !this.jwt.isTokenExpired(this.tokenService.getToken());
    })
    this.tokenService.nextRole()
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
        this.tokenService.nextRole() 
      })
    }
  }

  logout() {
    this.tokenService.logout();
    this.tokenService.nextRole()
  }
}
