import { TestBed } from '@angular/core/testing';

import { MediaCreateService } from "./media-create.service";

describe('MediaCreateService', () => {
  let service: MediaCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
