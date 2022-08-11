import { TestBed } from '@angular/core/testing';

import { IngredientReadService } from './ingredient-read.service';

describe('IngredientReadService', () => {
  let service: IngredientReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
