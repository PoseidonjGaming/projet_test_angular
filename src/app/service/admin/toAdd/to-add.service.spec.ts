import { TestBed } from '@angular/core/testing';

import { ToAddService } from './to-add.service';

describe('ToAddService', () => {
  let service: ToAddService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToAddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
