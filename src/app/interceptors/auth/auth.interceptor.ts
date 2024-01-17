import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../../service/api/token/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService)
  
  if (tokenService.isExist()) {
    let request = req.clone({
      setHeaders: {
        'Authorization': 'Bearer ' + tokenService.getToken(),
      },
    });
    return next(request)
  }
  return next(req)




};
