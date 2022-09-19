import { TestBed } from '@angular/core/testing';

import { IngredientUsageUpdateService } from './ingredient-usage-update.service';

describe('IngredientUsageUpdateService', () => {
  let service: IngredientUsageUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientUsageUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
