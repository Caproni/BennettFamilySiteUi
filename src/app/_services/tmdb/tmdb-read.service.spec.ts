import { TestBed } from '@angular/core/testing';

import { TmDbReadService } from './tmdb-read.service';

describe('TmDbReadService', () => {
  let service: TmDbReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmDbReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
