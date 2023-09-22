import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Series } from 'src/app/models/series.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiSeriesService extends ApiService<Series> {

  constructor(httpclient: HttpClient) { super(httpclient) }

  saveFiles(files: File[]) {
    let formData = new FormData();
    files.forEach(file => formData.append('files', file))
    return this.httpClient.post(`${this.API_BASE_URL}/series/save/files`, formData)
  }

  saveWithFile(series: Series, file: File) {
    let formData = new FormData()

    let headers = new HttpHeaders()
    headers.set('Content-Type', 'multipart/form-data')
    headers.set('Accept', 'multipart/form-data')
    formData.append('file', file)
    formData.append('series', JSON.stringify(series))
    return this.httpClient.post(`${this.API_BASE_URL}/series/save`, formData, {
      headers: headers
    })
  }

  filteredSearch(filter: any) {
    return this.httpClient.post<Series[]>(`${this.API_BASE_URL}/series/filteredSearch`, filter)
  }

  getByCategoryIds(ids: any) {
    return this.httpClient.post<Series[]>(`${this.API_BASE_URL}/series/byCategories`,ids)
  }
}
