import { TestBed } from '@angular/core/testing';

import { IngredientUsageReadService } from './ingredient-usage-read.service';

describe('IngredientUsageReadService', () => {
  let service: IngredientUsageReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientUsageReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
