import { TestBed } from '@angular/core/testing';

import { FamilyTreePersonUpdateService } from './family-tree-person-update.service';

describe('FamilyTreePersonUpdateService', () => {
  let service: FamilyTreePersonUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreePersonUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
