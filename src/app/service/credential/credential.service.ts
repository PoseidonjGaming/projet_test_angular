import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Credential } from 'src/app/models/credential.model';

@Injectable({
  providedIn: 'root'
})
export class CredentialService {
  protected API_BASE_URL = 'http://localhost:8081'

  constructor(private httpClient: HttpClient) { }

  authenticate(credentials: Credential) {
    return this.httpClient.post(`${this.API_BASE_URL}/user/authenticate`, credentials)
  }
}
