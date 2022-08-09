import { TestBed } from '@angular/core/testing';

import { FamilyTreeDataSourceCreateService } from './family-tree-data-source-create.service';

describe('FamilyTreeDataSourceCreateService', () => {
  let service: FamilyTreeDataSourceCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreeDataSourceCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
