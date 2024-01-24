import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '../../service/api/token/token.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const adminRoles=['ROLE_admin', 'ROLE_super_admin']
  const tokenService = inject(TokenService)  
  return (tokenService.isExist()
    && !inject(JwtHelperService).isTokenExpired(tokenService.getToken())
    && adminRoles.includes(tokenService.getRole())) ? true :
    inject(Router).createUrlTree(['/'])
    ;;
};
