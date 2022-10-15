import { TestBed } from '@angular/core/testing';

import { ContentCreateService } from "./content-create.service";

describe('ContentCreateService', () => {
  let service: ContentCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
