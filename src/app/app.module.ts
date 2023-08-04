import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './compo/menu/menu/menu.component';
import { ImportDialogComponent } from './compo/menu/import-dialog/import-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ExportDialogComponent } from './compo/menu/export-dialog/export-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ImportDialogComponent,
    ExportDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
