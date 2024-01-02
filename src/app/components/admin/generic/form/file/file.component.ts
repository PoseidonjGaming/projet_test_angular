import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { DisplayFileDialogComponent } from './display-file-dialog/display-file-dialog.component';

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './file.component.html',
  styleUrl: './file.component.css'
})
export class FileComponent implements OnInit {


  @Input({ required: true }) form = new FormGroup({})
  @Input({ required: true }) control = { name: '', type: '' }


  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.form.addControl(this.getControlName(),
      new FormControl(null))
  }

  setPoster(event: any) {
    let file = event.target.files[0] as File
    this.form.get(this.getControlName())?.setValue(file)
    this.form.get(this.control.name)?.setValue(file.name)

  }

  openPosterDialog() {
    this.dialog.open(DisplayFileDialogComponent, {
      data: this.form.get(this.getControlName())?.value
    })
  }

  getControlName() {
    return this.control.name.concat('File')
  }
}
