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

  getByUsername() {
    return this.httpClient.get<User>(`${this.API_BASE_URL}/user/search/${this.tokenService.getUsername()}`)
  }

  addToWatchlist(seriesId: number) {
    return this.httpClient.get<Series[]>(`${this.API_BASE_URL}/user/watch/add/${seriesId}?username=${this.tokenService.getUsername()}`)
  }

  removeFromWatchlist(seriesId: number) {
    return this.httpClient.get<Series[]>(`${this.API_BASE_URL}/user/watch/remove/${seriesId}?username=${this.tokenService.getUsername()}`)
  }
}
