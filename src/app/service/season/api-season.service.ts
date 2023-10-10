import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Season } from 'src/app/models/season.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiSeasonService extends ApiService<Season>{

  constructor(httpClient: HttpClient) {
    super(httpClient)
    this.type='season'
  }

  getBySeriesId(id: string) {
    return this.httpClient.get<Season[]>(`${this.API_BASE_URL}/season/bySeries/${id}`)
  }
}
