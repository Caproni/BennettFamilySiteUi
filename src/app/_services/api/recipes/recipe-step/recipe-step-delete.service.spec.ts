import { TestBed } from '@angular/core/testing';

import { RecipeStepDeleteService } from "./recipe-step-delete.service";

describe('RecipeStepDeleteService', () => {
  let service: RecipeStepDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeStepDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
