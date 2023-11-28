import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Series } from 'src/app/models/series.model';
import { ApiService } from '../api.service';

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
