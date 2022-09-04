import { TestBed } from '@angular/core/testing';

import { IngredientUpdateService } from './ingredient-update.service';

describe('IngredientUpdateService', () => {
  let service: IngredientUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
