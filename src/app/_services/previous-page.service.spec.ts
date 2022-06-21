import { TestBed } from '@angular/core/testing';

import { PreviousPageService } from './previous-page.service';

describe('PreviousPageService', () => {
  let service: PreviousPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviousPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
