import { TestBed } from '@angular/core/testing';

import { IngredientImagePutService } from './ingredient-image-put.service';

describe('IngredientImagePutService', () => {
  let service: IngredientImagePutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientImagePutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
