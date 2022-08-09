import { TestBed } from '@angular/core/testing';

import { FamilyTreePersonCreateService } from './family-tree-person-create.service';

describe('FamilyTreePersonCreateService', () => {
  let service: FamilyTreePersonCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreePersonCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
