import { TestBed } from '@angular/core/testing';

import { FamilyTreeRelationshipDeleteService } from './family-tree-relationship-delete.service';

describe('FamilyTreeRelationshipDeleteService', () => {
  let service: FamilyTreeRelationshipDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreeRelationshipDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
