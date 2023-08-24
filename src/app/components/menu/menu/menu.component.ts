import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  @ViewChild(MatMenuTrigger) trigger?: MatMenuTrigger;

  hide = true;

  formLogin = new FormGroup({
    username: new FormControl(null),
    password: new FormControl(null)
  })

  constructor(public dialog: MatDialog) { }

  openDialogImport() {
    this.dialog.open(ImportDialogComponent);
  }
  openDialogExport() {
    this.dialog.open(ExportDialogComponent);
  }

  submit() {
    this.trigger?.closeMenu()
    console.log(this.formLogin.value);
    //TODO call login api 
  }
}
