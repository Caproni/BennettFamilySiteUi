import { TestBed } from '@angular/core/testing';

import { ContentUpdateService } from './content-update.service';

describe('ContentUpdateService', () => {
  let service: ContentUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
