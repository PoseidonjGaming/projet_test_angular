import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Base } from '../../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private sub = new Subject<{dto:Base, isPost: boolean}>()

  constructor() { }

  get() {
    return this.sub.asObservable()
  }

  next(value: { dto: Base, isPost: boolean }) {
    this.sub.next(value)
  }
}
