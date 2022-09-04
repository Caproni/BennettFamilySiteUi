import { TestBed } from '@angular/core/testing';

import { IngredientCreateService } from './ingredient-create.service';

describe('IngredientCreateService', () => {
  let service: IngredientCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
