import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Series } from '../models/series.model';
import { Observable } from 'rxjs';
import { Base } from '../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected API_BASE_URL = 'http://localhost:8081'
  protected type: string = ''

  constructor(protected httpClient: HttpClient) { }

  getAll<E>(type?: String) {
    if (!type)
      type = this.type
    return this.httpClient.get<E[]>(`${this.API_BASE_URL}/${type}/list`)
  }

  getById<E>(id: string, type?: String,) {
    if (!type)
      type = this.type
    return this.httpClient.get<E>(`${this.API_BASE_URL}/${type}/detail/${id}`)
  }

  getByIds<E>(ids: number[], type?: String) {
    if (!type)
      type = this.type
    return this.httpClient.post<E[]>(`${this.API_BASE_URL}/${type}/byIds`, ids)
  }

  search<E>(type: String, dto: Base) {
    return this.httpClient.post<E[]>(`${this.API_BASE_URL}/${type}/search`, dto)
  }

  saves<E>(type: string, dtos: E[]) {
    return this.httpClient.post(`${this.API_BASE_URL}/${type}/saves`, dtos)
  }

  save<E>(type: string, dto: E): Observable<any> {
    return this.httpClient.post(`${this.API_BASE_URL}/${type}/save`, dto)
  }

  delete(type: String, id: String) {
    return this.httpClient.delete(`${this.API_BASE_URL}/${type}/delete/${id}`)
  }
}
