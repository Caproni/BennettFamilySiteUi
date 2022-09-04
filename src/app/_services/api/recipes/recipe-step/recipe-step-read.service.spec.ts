import { TestBed } from '@angular/core/testing';

import { RecipeStepReadService } from './recipe-step-read.service';

describe('RecipeStepReadService', () => {
  let service: RecipeStepReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeStepReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
