import { TestBed } from '@angular/core/testing';

import { ApiActorService } from './api-actor.service';

describe('ApiActorService', () => {
  let service: ApiActorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiActorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
