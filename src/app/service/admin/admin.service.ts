import { Injectable } from '@angular/core';
import { Base, BaseType } from '../../models/base.model';
import { ApiService } from '../api/api.service';
import { CrudService } from './crud/crud.service';
import { ToAddService } from './toAdd/to-add.service';
import { FormService } from './form/form.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private service: ApiService,
    private crudService: CrudService,
    private toAddService: ToAddService,
    private formService: FormService) { }

  init<T extends Base, E extends BaseType>(dto: T, types: E, controls: { name: string, type: string }[]) {
    return this.formService.createForm(dto, types, controls)
  }

  initMap(displays: { control: string, value: string }[]) {
    let map = new Map<string, string>()
    displays.forEach(d => {
      map.set(d.control, d.value)
    })

    return map
  }

  submit<E extends Base>(type: string, event: { dto: E, isSubmit: boolean }) {
    if (event.isSubmit) {
      this.service.save(type, event.dto).subscribe((entity) => {
        this.crudService.next(entity)
      })
    }
    else
      this.toAddService.next(event.dto)
  }

  saves<T extends Base>(type: string, dto: T, values: Base[]) {
    this.service.saves(type, values).subscribe(() => {
      this.crudService.next(dto)
      this.toAddService.next(dto)
    })
  }
}
