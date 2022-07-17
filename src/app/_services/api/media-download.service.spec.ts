import { TestBed } from '@angular/core/testing';

import { MediaDownloadService } from "./media-download.service";

describe('MediaDownloadService', () => {
  let service: MediaDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
