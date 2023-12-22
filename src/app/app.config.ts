import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import fr from '@angular/common/locales/fr';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { routes } from './app.routes';

registerLocaleData(fr);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding()),
  provideClientHydration(),
  provideAnimations(),
  provideHttpClient(withFetch()),
  {
    provide: LOCALE_ID, useValue: 'fr-FR'
  },
  importProvidersFrom(
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:4200'],
        disallowedRoutes: ['/admin']
      }
    })
  )]
};

export function tokenGetter() {
  return localStorage.getItem("jToken");
}
