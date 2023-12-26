import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Base } from '../../models/base.model';


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

  updateValues<T extends Base>(dto: T, form: FormGroup) {
    let returnedDto=new Base()
    Object.keys(dto).forEach((e: string) => {
      const control = form.get(e)
      if (control) {
        returnedDto[e] = control.value
      }

    })
    return returnedDto
  }
}
