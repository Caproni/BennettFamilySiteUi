import { TestBed } from '@angular/core/testing';

import { FamilyTreeRelationshipCreateService } from './family-tree-relationship-create.service';

describe('FamilyTreeRelationshipCreateService', () => {
  let service: FamilyTreeRelationshipCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreeRelationshipCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
