import { TestBed } from '@angular/core/testing';

import { IngredientDeleteService } from "./ingredient-delete.service";

describe('IngredientDeleteService', () => {
  let service: IngredientDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
