import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { CredentialService } from '../../service/api/credential/credential.service';
import { TokenService } from '../../service/api/token/token.service';
import { UtilsService } from '../../service/utils/utils.service';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';
import { ImportDialogComponent } from './import-dialog/import-dialog.component';
import { Router, RouterLink } from '@angular/router';


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
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnDestroy {
  private rolesAdmin = ['ROLE_super_admin']
  private subjectRole?: Subscription
  hide = true;
  isLogged: boolean = false
  isAdmin: boolean = false
  username: string = ''

  @Output()
  isLoggedEvent = new EventEmitter<boolean>()
  @Output()
  isStandardUserEvent = new EventEmitter<boolean>()

  formLogin = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  })



  constructor(public dialog: MatDialog,
    private service: CredentialService,
    private tokenService: TokenService,
    private utilsService: UtilsService,
    private jwt: JwtHelperService,
    private router: Router) { }


  ngOnDestroy(): void {
    if (this.subjectRole)
      this.subjectRole.unsubscribe()
  }


  ngOnInit(): void {
    if (!this.subjectRole) {
      this.subjectRole = this.tokenService.subscribeRole().subscribe((role) => {
        this.isLogged = this.tokenService.isExist() && !this.jwt.isTokenExpired(this.tokenService.getToken());
        this.isAdmin = this.isLogged && this.rolesAdmin.includes(role)
        if (this.isLogged) {
          this.username = this.tokenService.getUsername()
        }

        this.isLoggedEvent.emit(this.isLogged)
        this.isStandardUserEvent.emit(this.isLogged && !this.isAdmin)
      })
    }

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
      this.service.authenticate(this.formLogin.getRawValue()).subscribe((token: any) => {
        this.tokenService.setToken(token.token)
        this.username = this.tokenService.getUsername()
        this.tokenService.nextRole()
        this.formLogin.reset()
        this.router.navigate([this.router.url])
      })
    }
  }

  logout() {
    this.tokenService.logout();
    this.tokenService.nextRole()
    this.router.navigate(['/'])
  }
}
