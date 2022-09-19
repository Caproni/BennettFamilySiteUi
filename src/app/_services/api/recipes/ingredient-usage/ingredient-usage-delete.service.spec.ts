import { TestBed } from '@angular/core/testing';

import { IngredientUsageDeleteService } from "./ingredient-usage-delete.service";

describe('IngredientUsageDeleteService', () => {
  let service: IngredientUsageDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientUsageDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
