import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { TokenService } from '../service/token/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService, public snackBar: MatSnackBar, private jwtHelper: JwtHelperService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.tokenService.isExist() && !this.jwtHelper.isTokenExpired(this.tokenService.getToken())) {
      request = request.clone({
        setHeaders: {
          'Authorization': 'Bearer ' + this.tokenService.getToken(),
        },
      });
    }

    return new Observable((obs) => {
      next.handle(request).subscribe({
        next: (res: HttpEvent<any>) => {
          obs.next(res)
        },
        error: (e: HttpErrorResponse) => {
          console.log(e);

          this.error(e.status)
        }
      })
    })
  }

  private error(error: number) {
    switch (error) {
      case 500: this.open('Erreur du serveur', 'Fermer');
        break;
      case 401: this.open('La session a expiré', 'Fermer');
        break;
      case 403: this.open('L\'accès est interdit', 'Fermer');
        break;
      default: this.open('Aucun message pour cette erreur', 'Fermer');
        break;
    }
  }

  private open(msg: string, action: string) {
    this.snackBar.open(msg, action, { duration: 10 * 1000 });
  }
}
