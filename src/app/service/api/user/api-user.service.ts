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

  addToWatchlist(id: number, watchlist: string) {
    return this.httpClient.get<number[]>(`${this.API_BASE_URL}/watchlist/add/${watchlist}/${id}?username=${this.tokenService.getUsername()}`)
  }

  removeFromWatchlist(id: number, watchlist: string) {
    return this.httpClient.get<number[]>(`${this.API_BASE_URL}/watchlist/remove/${watchlist}/${id}?username=${this.tokenService.getUsername()}`)
  }
}
