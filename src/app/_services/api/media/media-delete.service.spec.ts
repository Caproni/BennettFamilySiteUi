import { TestBed } from '@angular/core/testing';

import { MediaDeleteService } from './media-delete.service';

describe('MediaDeleteService', () => {
  let service: MediaDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
