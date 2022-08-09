import { TestBed } from '@angular/core/testing';

import { FamilyTreeRelationshipUpdateService } from './family-tree-relationship-update.service';

describe('FamilyTreeRelationshipUpdateService', () => {
  let service: FamilyTreeRelationshipUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreeRelationshipUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
