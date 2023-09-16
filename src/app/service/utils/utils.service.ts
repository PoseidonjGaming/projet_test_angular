import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Base } from 'src/app/models/base.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  populate<E extends Base>(entity: E, form: FormGroup) {
    Object.keys(entity).forEach((e: string) => {
      let control = form.get(e)
      console.log(e);
      
      if (control)
        control.setValue(entity[e])
    })
  }
}
