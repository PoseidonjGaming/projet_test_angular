import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Series } from '../models/series.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService<E>{

  protected API_BASE_URL = 'http://localhost:8081'
  protected type: string = ''

  constructor(protected httpClient: HttpClient) { }

  getAll(type?: String) {
    if (!type)
      type = this.type
    return this.httpClient.get<E[]>(`${this.API_BASE_URL}/${type}/list`)
  }

  getById(id: string, type?: String,) {
    if (!type)
      type = this.type
    return this.httpClient.get<E>(`${this.API_BASE_URL}/${type}/detail/${id}`)
  }

  getByIds(ids: number[], type?: String) {
    if (!type)
      type = this.type
    return this.httpClient.post<E[]>(`${this.API_BASE_URL}/${type}/byIds`, ids)
  }

  search(type: String, term: String) {
    return this.httpClient.get<E[]>(`${this.API_BASE_URL}/${type}/search?term=${term}`)
  }

  saves(type: string, dtos: E[]) {
    return this.httpClient.post(`${this.API_BASE_URL}/${type}/saves`, dtos)
  }

  save(type: string, dto: E): Observable<any> {
    return this.httpClient.post(`${this.API_BASE_URL}/${type}/save`, dto)
  }

  delete(type: String, id: String) {
    return this.httpClient.delete(`${this.API_BASE_URL}/${type}/delete/${id}`)
  }
}
