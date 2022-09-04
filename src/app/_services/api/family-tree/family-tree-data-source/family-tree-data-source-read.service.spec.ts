import { TestBed } from '@angular/core/testing';

import { FamilyTreeDataSourceReadService } from './family-tree-data-source-read.service';

describe('FamilyTreeDataSourceReadService', () => {
  let service: FamilyTreeDataSourceReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyTreeDataSourceReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
