import { TestBed } from '@angular/core/testing';

import { ApiEpisodeService } from './api-episode.service';

describe('ApiEpisodeService', () => {
  let service: ApiEpisodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiEpisodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
