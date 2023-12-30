import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { Credential } from '../../../models/credential.model'
import { User } from '../../../models/user.model';
import { Base } from '../../../models/base.model';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {
  protected API_BASE_URL = 'http://localhost:8081'

  constructor(private httpClient: HttpClient, private tokenService: TokenService) { }

  authenticate(credentials: Base) {
    return this.httpClient.post(`${this.API_BASE_URL}/user/authenticate`, credentials)
  }

  registrate(user: Base) {
    return this.httpClient.post(`${this.API_BASE_URL}/user/registration`, user)
  }

  isExist() {
    return this.httpClient.get<boolean>(`${this.API_BASE_URL}/user/exist?username=${this.tokenService.getClaims().sub}`)
  }
}
