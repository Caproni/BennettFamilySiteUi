import { TestBed } from '@angular/core/testing';

import { ContentReadService } from "./content-read.service";

describe('ContentReadService', () => {
  let service: ContentReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
