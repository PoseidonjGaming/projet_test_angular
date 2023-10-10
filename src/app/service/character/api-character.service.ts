import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Character } from 'src/app/models/character.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiCharacterService extends ApiService<Character>{

  constructor(httpClient: HttpClient) {
    super(httpClient)
    this.type = 'character'
  }
}
