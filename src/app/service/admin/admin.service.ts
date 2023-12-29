import { Injectable } from '@angular/core';
import { Base } from '../../models/base.model';
import { ApiService } from '../api/api.service';
import { CrudService } from './crud/crud.service';
import { ToAddService } from './toAdd/to-add.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private service: ApiService,
    private crudService: CrudService,
    private toAddService: ToAddService) { }

  submit<E extends Base>(type: string, event: { dto: E, isSubmit: boolean }) {
    if (event.isSubmit)
      this.service.save(type, event.dto).subscribe((entity) => {
        this.crudService.next(entity)
      })
    else
      this.toAddService.next(event.dto)
  }
}
