import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Series } from '../models/series.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService<E>{

  protected API_BASE_URL = 'http://localhost:8081'

  constructor(protected httpClient: HttpClient) { }

  getAll(type: String) {
    return this.httpClient.get<E[]>(`${this.API_BASE_URL}/${type}/list`)
  }

  getById(type: String, id: string) {
    return this.httpClient.get<E>(`${this.API_BASE_URL}/${type}/detail/${id}`)
  }

  saves(type: string, dtos: E[]) {
    return this.httpClient.post(`${this.API_BASE_URL}/${type}/saves/`, dtos)
  }
}
