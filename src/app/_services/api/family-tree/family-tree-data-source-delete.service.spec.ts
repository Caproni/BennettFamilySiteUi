import { TestBed } from '@angular/core/testing';

import { FamilyTreeDataSourceDeleteService } from './family-tree-data-source-delete.service';

describe('FamilyTreeDataSourceDeleteService', () => {
  let service: FamilyTreeDataSourceDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreeDataSourceDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
