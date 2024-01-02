import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-display-file-dialog',
  standalone: true,
  imports: [],
  templateUrl: './display-file-dialog.component.html',
  styleUrl: './display-file-dialog.component.css'
})
export class DisplayFileDialogComponent {
  file64: string = ''

  constructor(@Inject(MAT_DIALOG_DATA) private data: File | undefined) { }

  ngOnInit(): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.file64 = reader.result?.toString()!
    }
    if (this.data)
      reader.readAsDataURL(this.data);
  }
}
