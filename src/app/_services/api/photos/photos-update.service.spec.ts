import { TestBed } from '@angular/core/testing';

import { PhotosUpdateService } from './photos-update.service';

describe('PhotosUpdateService', () => {
  let service: PhotosUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotosUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
