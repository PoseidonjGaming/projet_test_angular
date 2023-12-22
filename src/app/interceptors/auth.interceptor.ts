import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof (window) !== 'undefined') {
    req = req.clone({
      setHeaders: {
        'Authorization': 'Bearer ' + localStorage.getItem('jToken'),
      },
    })
  }

  return next(req)
};
