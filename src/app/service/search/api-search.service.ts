import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Base } from 'src/app/models/base.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiSearchService extends ApiService {

  constructor(httpClient: HttpClient) { super(httpClient) }

  filteredSearch<E extends Base>(filter: E, type: string) {
    return this.httpClient.post<E[]>(`${this.API_BASE_URL}/${type}/filteredSearch`, filter)
  }

  getByCategoryIds<E extends Base>(ids: number[], type: string) {
    return this.httpClient.post<E[]>(`${this.API_BASE_URL}/${type}/byCategories`, ids)
  }

}
