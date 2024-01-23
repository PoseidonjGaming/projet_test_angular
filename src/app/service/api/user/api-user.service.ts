import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../token/token.service';
import { User } from '../../../models/user.model';
import { Series } from '../../../models/series.model';

@Injectable({
  providedIn: 'root'
})
export class ApiUserService extends ApiService {

  constructor(httpClient: HttpClient, private tokenService: TokenService) { super(httpClient) }

  addToWatchlist(seriesId: number) {
    return this.httpClient.get<Series[]>(`${this.API_BASE_URL}/user/watch/${seriesId}?username=${this.tokenService.getUsername()}`)
  }
}
