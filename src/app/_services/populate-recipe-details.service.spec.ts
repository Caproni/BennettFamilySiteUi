import { TestBed } from '@angular/core/testing';

import { PopulateRecipeDetailsService } from './populate-recipe-details.service';

describe('PopulateRecipeDetailsService', () => {
  let service: PopulateRecipeDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopulateRecipeDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
