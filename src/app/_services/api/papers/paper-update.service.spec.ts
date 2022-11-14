import { TestBed } from '@angular/core/testing';

import { PaperUpdateService } from './paper-update.service';

describe('PapertUpdateService', () => {
  let service: PaperUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaperUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
