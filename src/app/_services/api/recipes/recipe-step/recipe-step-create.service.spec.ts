import { TestBed } from '@angular/core/testing';

import { RecipeStepCreateService } from './recipe-step-create.service';

describe('RecipeStepCreateService', () => {
  let service: RecipeStepCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeStepCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
