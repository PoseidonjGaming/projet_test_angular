import { Component } from '@angular/core';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.css']
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
