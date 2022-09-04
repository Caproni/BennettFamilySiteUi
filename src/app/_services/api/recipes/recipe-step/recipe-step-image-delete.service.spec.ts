import { TestBed } from '@angular/core/testing';

import { RecipeStepImageDeleteService } from "./recipe-step-image-delete.service";

describe('RecipeStepImageDeleteService', () => {
  let service: RecipeStepImageDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeStepImageDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
