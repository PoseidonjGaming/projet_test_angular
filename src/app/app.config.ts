import { ApplicationConfig, Injectable, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy, provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import fr from '@angular/common/locales/fr';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth/auth.interceptor';
import { errorInterceptor } from './interceptors/error/error.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

registerLocaleData(fr);

@Injectable()
export class RouteStrategy extends RouteReuseStrategy {
  override shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  override store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
  }
  override shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  override retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }
  override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false;
  }

}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: LOCALE_ID, useValue: 'fr-FR'
    },
    {
      provide: RouteReuseStrategy, useClass: RouteStrategy
    },
    provideRouter(routes,
      withComponentInputBinding(),
    ),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:4200'],
          disallowedRoutes: ['/admin']
        }
      })
    ), provideAnimationsAsync()]
};

export function tokenGetter() {
  return localStorage.getItem("jToken");
}

