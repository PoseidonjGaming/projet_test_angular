import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  protected API_BASE_URL = 'http://localhost:8081'

  constructor(private httpClient: HttpClient) { }

  export(bools: boolean[]){
    return this.httpClient.post<Blob>(`${this.API_BASE_URL}/file/export`,bools)
  }
}
