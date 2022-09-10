import { TestBed } from '@angular/core/testing';

import { FamilyTreePersonImageDeleteService } from './family-tree-person-image-delete.service';

describe('FamilyTreePersonImageDeleteService', () => {
  let service: FamilyTreePersonImageDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreePersonImageDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
