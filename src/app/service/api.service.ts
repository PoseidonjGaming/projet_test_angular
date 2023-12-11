import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Series } from '../models/series.model';
import { Observable } from 'rxjs';
import { Base } from '../models/base.model';
import { MatchMode } from '../models/enum/MatchMode.model';
import { StringMatcher } from '../models/enum/StringMatcher.model';
import { Sorter } from '../models/Sorter.model';
import { PageResponse } from '../models/PageResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  protected API_BASE_URL = 'http://localhost:8081'
  protected type: string = ''

  constructor(protected httpClient: HttpClient) { }

  getAll<E extends Base>(type: String) {
    return this.httpClient.get<E[]>(`${this.API_BASE_URL}/${type}/list`)
  }

  getAllPaged<E extends Base>(type: string, size: number, page: number) {
    return this.httpClient.get<PageResponse<E>>(`${this.API_BASE_URL}/${type}/paged/list?size=${size}&page=${page}`)
  }

  getById<E extends Base>(type: string, id: number) {
    return this.httpClient.get<E>(`${this.API_BASE_URL}/${type}/detail/${id}`)
  }

  getByIds<E extends Base>(type: string, ids: number[]) {
    return this.httpClient.post<E[]>(`${this.API_BASE_URL}/${type}/byIds`, ids)
  }

  search<E extends Base>(type: string, dto: Base, mode: MatchMode, matcher: StringMatcher, startDate: Date | null, endDate: Date | null) {
    return this.httpClient.post<E[]>(`${this.API_BASE_URL}/${type}/search`, {
      dto: dto,
      mode: mode,
      type: matcher,
      startDate: startDate,
      endDate: endDate
    })
  }

  searchPaged<E extends Base>(type: string, dto: Base,
    mode: MatchMode, matcher: StringMatcher,
    startDate: Date | null, endDate: Date | null,
    size: number, page: number) {
    return this.httpClient.post<PageResponse<E>>(`${this.API_BASE_URL}/${type}/paged/search?size=${size}&page=${page}`, {
      dto: dto,
      mode: mode,
      type: matcher,
      startDate: startDate,
      endDate: endDate
    })
  }

  sort<E extends Base>(type: string, field: string, direction: Sorter) {
    return this.httpClient.post<E[]>(`${this.API_BASE_URL}/${type}/sort`, {
      field: field,
      direction: direction
    })
  }
  sortPaged<E extends Base>(type: string, field: string, direction: Sorter, size: number, page: number) {
    return this.httpClient.post<E[]>(`${this.API_BASE_URL}/${type}/page/sort?size=${size}&page=${page}`, {
      field: field,
      direction: direction
    })
  }

  save<E extends Base>(type: string, dto: E) {
    return this.httpClient.post<E>(`${this.API_BASE_URL}/${type}/save`, dto)
  }

  saves<E extends Base>(type: string, dtos: E[]) {
    return this.httpClient.post(`${this.API_BASE_URL}/${type}/saves`, dtos)
  }

  saveFiles(files: File[]) {
    let formData = new FormData();
    files.forEach(file => formData.append('files', file))
    return this.httpClient.post(`${this.API_BASE_URL}/series/save/files`, formData)
  }

  saveWithFile<E extends Base>(type: string, dtos: E, file: File) {
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

  delete(type: string, id: number) {
    return this.httpClient.delete(`${this.API_BASE_URL}/${type}/delete/${id}`)
  }
}
