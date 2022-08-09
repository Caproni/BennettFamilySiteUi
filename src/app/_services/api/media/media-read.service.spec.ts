import { TestBed } from '@angular/core/testing';

import { MediaReadService } from "./media-read.service";

describe('MediaReadService', () => {
  let service: MediaReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
