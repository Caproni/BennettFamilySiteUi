import { TestBed } from '@angular/core/testing';

import { FamilyTreePersonImagePutService } from './family-tree-person-image-put.service';

describe('FamilyTreePersonImagePutService', () => {
  let service: FamilyTreePersonImagePutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreePersonImagePutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
