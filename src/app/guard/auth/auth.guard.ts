import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../service/api/token/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService)
  return (tokenService.isExist()
    && !inject(JwtHelperService).isTokenExpired(tokenService.getToken())) ? true : 
    inject(Router).createUrlTree(['/'])
  ;
};
