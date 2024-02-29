import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Episode } from '../../../models/episode.model';
import { Base, BaseType } from '../../../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private formBuidler: FormBuilder) { }

  createForm<T extends Base, E extends BaseType>(dto: T, types: E, controls: { name: string, type: string }[]) {
    let form = this.formBuidler.nonNullable.group(dto)
    Object.keys(form.controls).forEach(controlName => {
      controls.push({ name: controlName, type: types[controlName] })
    })

    return form
  }
}
