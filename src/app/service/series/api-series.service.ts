import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Series } from '../../models/series.model';

@Injectable({
  providedIn: 'root'
})
export class ApiSeriesService extends ApiService {

  constructor(httpclient: HttpClient) {
    super(httpclient)
    this.type = 'series'
  }

  saveWithSeasons(series: Series, seasons: number) {
    return this.httpClient.post<Series>(`${this.API_BASE_URL}/series/save/seasons?seasons=${seasons}`, series)
  }


}
