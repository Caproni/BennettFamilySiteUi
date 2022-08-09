import { TestBed } from '@angular/core/testing';

import { FamilyTreePersonDeleteService } from './family-tree-person-delete.service';

describe('FamilyTreePersonDeleteService', () => {
  let service: FamilyTreePersonDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreePersonDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
