import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenGuard } from '../token/token.guard';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from 'src/app/service/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard extends TokenGuard {

  constructor(router: Router, tokenService: TokenService, jwt: JwtHelperService) {
    super(router, tokenService, jwt)
    this.role='ROLE_super_admin'
  }

}
