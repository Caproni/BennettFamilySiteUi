import { TestBed } from '@angular/core/testing';

import { RecipeImageDeleteService } from "./recipe-image-delete.service";

describe('RecipeImageDeleteService', () => {
  let service: RecipeImageDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeImageDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
