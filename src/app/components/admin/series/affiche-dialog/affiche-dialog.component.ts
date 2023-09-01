import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-affiche-dialog',
  templateUrl: './affiche-dialog.component.html',
  styleUrls: ['./affiche-dialog.component.css']
})
export class AfficheDialogComponent implements OnInit {

  file64: string = ''

  constructor(@Inject(MAT_DIALOG_DATA) private data: File | undefined,
    private dialogRef: MatDialogRef<AfficheDialogComponent>) { }

  ngOnInit(): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.file64=reader.result?.toString()!
    }
    if (this.data)
      reader.readAsDataURL(this.data);
  }
}
