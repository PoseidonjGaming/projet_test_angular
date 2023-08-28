import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { CredentialService } from 'src/app/service/credential/credential.service';
import { Credential } from 'src/app/models/credential.model';
import { TokenService } from 'src/app/service/token/token.service';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{

  @ViewChild(MatMenuTrigger) trigger?: MatMenuTrigger;

  hide = true;
  isLogged: boolean = false

  formLogin = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  constructor(public dialog: MatDialog, private service: CredentialService, private tokenService: TokenService) { }
  ngOnInit(): void {
    this.isLogged = this.tokenService.isExist();
  }

  openDialogImport() {
    this.dialog.open(ImportDialogComponent);
  }
  openDialogExport() {
    this.dialog.open(ExportDialogComponent);
  }

  submit() {
    this.trigger?.closeMenu()
    this.service.authenticate(this.formLogin.value as Credential).subscribe((token: any) => {
      this.tokenService.setToken(token.token)
      window.location.reload()
    })
  }

  logout() {
    this.tokenService.logout();
    this.isLogged = false
    window.location.reload()
  }
}
