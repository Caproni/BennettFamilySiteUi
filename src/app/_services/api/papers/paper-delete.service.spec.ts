import { TestBed } from '@angular/core/testing';

import { PaperDeleteService } from './paper-delete.service';

describe('PaperDeleteService', () => {
  let service: PaperDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaperDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
