import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService<ENTITY> {

  constructor(protected httpClient: HttpClient) {    
  }

  getAll() {
    return this.httpClient.get<ENTITY>("localhost:8081/")
  }
}
