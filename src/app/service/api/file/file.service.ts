import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  protected API_BASE_URL = 'http://localhost:8081'

  constructor(private httpClient: HttpClient) { }

  export(datas: string[]) {
    return this.httpClient.post<any>(`${this.API_BASE_URL}/file/export`, datas)
  }

  upload(file: File, type: string) {
    let formData = new FormData()

    let headers = new HttpHeaders()
    headers.set('Content-Type', 'multipart/form-data')
    headers.set('Accept', 'multipart/form-data')
    formData.append('file', file)
    return this.httpClient.post(`${this.API_BASE_URL}/file/save?type=${type}`, formData, {
      headers: headers
    })
  }
}
