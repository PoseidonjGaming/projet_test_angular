import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Saison } from 'src/app/models/saison.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiSaisonService extends ApiService<Saison>{

  constructor(httpClient: HttpClient) { super(httpClient) }

  getBySeriesId(id: string) {
    return this.httpClient.get<Saison[]>(`${this.API_BASE_URL}/saison/bySeries/${id}`)
  }
}
