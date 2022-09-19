import { TestBed } from '@angular/core/testing';

import { IngredientUsageCreateService } from './ingredient-usage-create.service';

describe('IngredientUsageCreateService', () => {
  let service: IngredientUsageCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientUsageCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
