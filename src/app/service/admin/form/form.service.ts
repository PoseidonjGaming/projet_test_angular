import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Episode } from '../../../models/episode.model';
import { Base } from '../../../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(private formBuidler: FormBuilder) { }

  createForm<T extends Base>(dto: T, controls: { name: string, type: string }[]) {
    let form = this.formBuidler.nonNullable.group(dto)
    Object.keys(form.controls).forEach(controlName => {
      controls.push({ name: controlName, type: typeof (form.controls[controlName].value) })
    })

    return form
  }
}
