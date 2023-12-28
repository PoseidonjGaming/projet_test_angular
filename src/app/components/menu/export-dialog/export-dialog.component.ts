import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FileService } from '../../../service/api/file/file.service';

@Component({
  selector: 'app-export-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.css'
})
export class ExportDialogComponent {
  export = new FormGroup({
    serie: new FormControl(false),
    episode: new FormControl(false),
    actor: new FormControl(false),
    character: new FormControl(false)
  })

  constructor(private service: FileService) { }

  submit() {
    console.log("test");
    let bools: boolean[] = []
    Object.keys(this.export.controls).forEach((e: string) => {
      bools.push(this.export.get(e)?.value)
    })
    this.service.export(bools).subscribe((blob: Blob) => {
      console.log(blob);

    })
    //TODO call api to save file file
  }
}

