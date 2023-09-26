import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Actor } from 'src/app/models/actor.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiActorService extends ApiService<Actor>{

  constructor(httpClient: HttpClient) {
    super(httpClient)
    this.type='actor'
  }
}
