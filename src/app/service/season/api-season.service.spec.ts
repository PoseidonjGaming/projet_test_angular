import { TestBed } from '@angular/core/testing';

import { ApiSeasonService } from './api-season.service';

describe('ApiSaisonService', () => {
  let service: ApiSeasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSeasonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
