import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileService } from 'src/app/service/file/file.service';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css']
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
    this.service.export(bools).subscribe((blob: Blob)=>{
      console.log(blob);
      
    })
    //TODO call api to save file file
  }
}
