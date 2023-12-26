import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { Episode } from '../../models/episode.model';

@Injectable({
  providedIn: 'root'
})
export class ApiEpisodeService extends ApiService{

  constructor(httpClient: HttpClient) {
    super(httpClient)
    this.type='episode'
  }

  getBySeasonIdIn(id: string[]) {
    return this.httpClient.get<Episode[]>(`${this.API_BASE_URL}/episode/bySeasons/${id}`)
  }
}
