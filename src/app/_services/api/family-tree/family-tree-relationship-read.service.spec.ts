import { TestBed } from '@angular/core/testing';

import { FamilyTreeRelationshipReadService } from './family-tree-relationship-read.service';

describe('FamilyTreeRelationshipReadService', () => {
  let service: FamilyTreeRelationshipReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreeRelationshipReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
