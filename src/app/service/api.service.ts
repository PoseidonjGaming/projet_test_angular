import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService<ENTITY>{

  constructor(private httpClient: HttpClient) { }

  getAll(type: string) {
    return this.httpClient.get<ENTITY[]>(`http://localhost:8081/${type}/list`)
  }
}
