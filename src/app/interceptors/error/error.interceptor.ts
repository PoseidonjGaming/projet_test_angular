import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, delay, interval, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(MatSnackBar)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      return throwError(() => {
        if (error)
          snack.open(error.message, 'Fermer', { duration: 5 * 1000 })
      })
    })
  )
};
