import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Base } from '../../../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private dataSource = new Subject<Base>()

  constructor() { }

  get() {
    return this.dataSource
  }

  next(value: Base) {
    this.dataSource.next(value)
  }
}
