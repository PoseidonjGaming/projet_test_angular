import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Base } from '../../models/base.model';
import { ApiService } from '../api/api.service';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private service: ApiService) { }

  populate<E extends Base>(entity: E, form: FormGroup, typeMap?: Map<string, string>) {
    Object.keys(entity).forEach((e: string) => {
      if (e.endsWith('Ids')) {
        const controlName = this.getRelatedName(e, 3)
        let control = form.controls[controlName]
        if (control && typeMap) {
          this.service.getByIds(typeMap.get(e)!,
            entity[e]).subscribe(values => control.setValue(values))
        }
      } else {
        let control = form.get(e)
        if (control)
          control.setValue(entity[e])
      }

    })
  }

  updateValues<T extends Base>(dto: T, form: FormGroup) {
    let returnedDto = new Base()
    Object.keys(dto).forEach((e: string) => {
      const control = form.get(e)
      if (control) {
        returnedDto[e] = control.value
      }

    })
    return returnedDto
  }

  getRelatedName(controlRelatedName: string, removes: number) {
    return controlRelatedName.slice(0, controlRelatedName.length - removes)
  }

  getDisplay<E extends Base>(dto: E, displays: string[]) {
    let display = ''
    displays.forEach(d => {
      display = display.concat(` ${dto[d]}`)
    })
    return display
  }
}
