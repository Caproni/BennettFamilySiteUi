import { TestBed } from '@angular/core/testing';

import { PaperCreateService } from "./paper-create.service";

describe('PaperCreateService', () => {
  let service: PaperCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaperCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
