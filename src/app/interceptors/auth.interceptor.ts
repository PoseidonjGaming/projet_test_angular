import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../service/token/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { request } from 'http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService)
  if (tokenService.isExist() && !inject(JwtHelperService).isTokenExpired(tokenService.getToken())) {
    let request = req.clone({
      setHeaders: {
        'Authorization': 'Bearer ' + tokenService.getToken(),
      },
    });
    return next(request)
  }
  return next(req)


};
