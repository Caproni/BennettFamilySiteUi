import { TestBed } from '@angular/core/testing';

import { PaperReadService } from "./paper-read.service";

describe('PaperReadService', () => {
  let service: PaperReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaperReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
