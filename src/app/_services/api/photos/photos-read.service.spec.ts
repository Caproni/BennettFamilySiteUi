import { TestBed } from '@angular/core/testing';

import { PhotosReadService } from "./photos-read.service";

describe('MediaReadService', () => {
  let service: PhotosReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotosReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
