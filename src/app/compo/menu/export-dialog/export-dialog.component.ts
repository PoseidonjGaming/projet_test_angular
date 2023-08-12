import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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

  submit() {
    console.log("test");
    //TODO call api to save file file
  }
}
