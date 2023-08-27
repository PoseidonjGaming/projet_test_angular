import { TestBed } from '@angular/core/testing';

import { ApiSaisonService } from './api-saison.service';

describe('ApiSaisonService', () => {
  let service: ApiSaisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSaisonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
