import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Base } from 'src/app/models/base.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  populate<E extends Base>(entity: E, form: FormGroup) {
    Object.keys(entity).forEach((e: string) => {
      let control = form.get(e)
      if (control)
        control.setValue(entity[e])
    })
  }

  updateValues<T extends Base>(entity: T, form: FormGroup) {
    Object.keys(form.controls).forEach((e: string) => {
      let control = form.get(e)      
      if (control)
        e = control.value
    })
    return entity
  }

  updateTable<E extends Base>(table: MatTable<E>) {
    table.renderRows()
  }

  reset() {
    var resetForm = <HTMLFormElement>document.getElementById('form');
    resetForm.reset();
  }



}
