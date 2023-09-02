import { Injectable } from '@angular/core';
import { Episode } from 'src/app/models/episode.model';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiEpisodeService extends ApiService<Episode>{

  constructor(httpClient: HttpClient) { super(httpClient) }

  betBySeasonIdIn(id: string[]) {
    return this.httpClient.get<Episode[]>(`${this.API_BASE_URL}/episode/bySaisons/${id}`)
  }
}
