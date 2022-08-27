import { TestBed } from '@angular/core/testing';

import { PhotosDeleteService } from './photos-delete.service';

describe('PhotoDeleteService', () => {
  let service: PhotosDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotosDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
