import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Series } from '../models/series.model';
import { Observable } from 'rxjs';
import { Base } from '../models/base.model';
import { MatchMode } from '../models/MatchMode.model';
import { StringMatcher } from '../models/StringMatcher.model';
import { Sorter } from '../models/Sorter.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected API_BASE_URL = 'http://localhost:8081'
  protected type: string = ''

  constructor(protected httpClient: HttpClient) { }

  getAll<E>(size: number, page: number, type?: String) {
    if (!type)
      type = this.type
    return this.httpClient.get<E>(`${this.API_BASE_URL}/${type}/list?size=${size}&page=${page}`)
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

  sort<E>(type: string, field: string, direction: Sorter) {
    return this.httpClient.get<E[]>(`${this.API_BASE_URL}/${type}/sort?field=${field}&direction=${direction}`)
  }

  saves<E>(type: string, dtos: E[]) {
    return this.httpClient.post(`${this.API_BASE_URL}/${type}/saves`, dtos)
  }

  save<E>(type: string, dto: E): Observable<E> {
    return this.httpClient.post<E>(`${this.API_BASE_URL}/${type}/save`, dto)
  }

  saveFiles(files: File[]) {
    let formData = new FormData();
    files.forEach(file => formData.append('files', file))
    return this.httpClient.post(`${this.API_BASE_URL}/series/save/files`, formData)
  }

  saveWithFile<E>(type: string, dtos: E, file: File) {
    let formData = new FormData()

    let headers = new HttpHeaders()
    headers.set('Content-Type', 'multipart/form-data')
    headers.set('Accept', 'multipart/form-data')
    formData.append('file', file)
    formData.append(type, JSON.stringify(dtos))
    return this.httpClient.post(`${this.API_BASE_URL}/${type}/save`, formData, {
      headers: headers
    })
  }

  delete(type: String, id: String) {
    return this.httpClient.delete(`${this.API_BASE_URL}/${type}/delete/${id}`)
  }
}
