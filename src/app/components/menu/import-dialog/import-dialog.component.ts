import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-import-dialog',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './import-dialog.component.html',
  styleUrl: './import-dialog.component.css'
})
export class ImportDialogComponent {
  files: File[] = []

  addFile(event: any) {
    let tempFiles: FileList = event.target.files
    for (let index = 0; index < tempFiles.length; index++) {
      if (!this.files.map((e) => e.name).includes(tempFiles[index].name, 0))
        this.files.push(tempFiles[index])
    }
  }

  submit() {
    console.log(this.files);
    //TODO call api to analyze file
  }
}
