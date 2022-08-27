import { TestBed } from '@angular/core/testing';

import { PhotosCreateService } from "./photos-create.service";

describe('PhotosCreateService', () => {
  let service: PhotosCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotosCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
