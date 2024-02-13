import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FileService } from '../../../service/api/file/file.service';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-export-dialog',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.css'
})
export class ExportDialogComponent {
  export = new FormGroup({
    series: new FormControl(false),
    episode: new FormControl(false),
    actor: new FormControl(false),
    character: new FormControl(false)
  })

  constructor(private service: FileService, private sanitizer: DomSanitizer) { }

  submit() {
    let selectedDatas: string[] = []
    Object.keys(this.export.controls).forEach((e: string) => {
      console.log(e);
      if (this.export.get(e)?.value) {
        selectedDatas.push(e)
      }

    })

    this.service.export(selectedDatas).subscribe((blob: any) => {
      // let fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      //   window.URL.createObjectURL(blob)
      // )

    })
    //TODO call api to save file file
  }
}

