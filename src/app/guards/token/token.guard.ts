import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/service/token/token.service';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard  {

  protected role?: string

  constructor(private router: Router, private tokenService: TokenService, private jwt: JwtHelperService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var token = '';

    if (route.queryParamMap.get('token')) {
      token = route.queryParamMap.get('token')!;
    }
    else if (this.tokenService.isExist()) {
      token = this.tokenService.getToken()!;
    }

    if (token) {
      var decoded = this.tokenService.getClaims()

      if (decoded.Role === this.role && !this.jwt.isTokenExpired(this.tokenService.getToken())) {
        return true
      }
      else {
        this.router.navigate(['/'])
      }
    }
    else {
      this.router.navigate(['/'])
    }
    return false;
  }
  
}
