import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Credential } from '../../models/credential.model';
import { CredentialService } from '../../service/credential/credential.service';
import { TokenService } from '../../service/token/token.service';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink,
    MatToolbarModule,
    MatMenuModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
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
      this.isLogged = this.tokenService.isExist() && !this.jwt.isTokenExpired(this.tokenService.getToken()!);
    })
    this.tokenService.nextRole()

    if (this.tokenService.isExist() && this.tokenService.getClaims()) {
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
