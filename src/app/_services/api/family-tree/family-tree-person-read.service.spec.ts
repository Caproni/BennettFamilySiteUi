import { TestBed } from '@angular/core/testing';

import { FamilyTreePersonReadService } from './family-tree-person-read.service';

describe('FamilyTreePersonReadService', () => {
  let service: FamilyTreePersonReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreePersonReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
