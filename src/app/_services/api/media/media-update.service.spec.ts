import { TestBed } from '@angular/core/testing';

import { MediaUpdateService } from './media-update.service';

describe('MediaUpdateService', () => {
  let service: MediaUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
