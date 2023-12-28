import { TestBed } from '@angular/core/testing';

import { ApiSeriesService } from './api-series.service';

describe('ApiSeriesService', () => {
  let service: ApiSeriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSeriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
