import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpRequest } from '@angular/common/http';
import fr from '@angular/common/locales/fr';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActorComponent } from './components/admin/actor/actor.component';
import { CharacterComponent } from './components/admin/character/character.component';
import { EpisodeComponent } from './components/admin/episode/episode.component';
import { AfficheDialogComponent } from './components/admin/series/affiche-dialog/affiche-dialog.component';
import { SeriesComponent } from './components/admin/series/series.component';
import { DetailSeriesComponent } from './components/detail-series/detail-series.component';
import { HomeComponent } from './components/home/home.component';
import { ExportDialogComponent } from './components/menu/export-dialog/export-dialog.component';
import { ImportDialogComponent } from './components/menu/import-dialog/import-dialog.component';
import { MenuComponent } from './components/menu/menu/menu.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { SearchComponent } from './components/search/search.component';

registerLocaleData(fr);

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ImportDialogComponent,
    ExportDialogComponent,
    DetailSeriesComponent,
    HomeComponent,
    SeriesComponent,
    AfficheDialogComponent,
    EpisodeComponent,
    ActorComponent,
    CharacterComponent,
    ProfileComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatListModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatSidenavModule,
    MatChipsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:4200"],
        disallowedRoutes: ["localhost:4200/admin/"],
      }
    })
  ],
  providers: [
    {
      provide: LOCALE_ID, useValue: 'fr-FR'
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function tokenGetter(request?: HttpRequest<any> | undefined): string | Promise<string | null> | null {
  return localStorage.getItem('jToken');
}
