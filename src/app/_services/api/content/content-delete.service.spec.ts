import { TestBed } from '@angular/core/testing';

import { ContentDeleteService } from './content-delete.service';

describe('ContentDeleteService', () => {
  let service: ContentDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
