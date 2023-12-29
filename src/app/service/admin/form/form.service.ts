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

  mapId(form: FormGroup, endWith: string) {
    Object.keys(form.controls).filter(c => c.endsWith(endWith)).forEach(controlName => {
      const entityName = controlName.slice(0, controlName.length - endWith.length)
      let controlId = form.controls[controlName]
      const control = form.controls[entityName]
      if (control && controlId) {
        controlId.setValue((endWith === 'Id') ? control.value['id'] : control.value.map((e: Base) => e['id']))
      }
    })
  }
}
