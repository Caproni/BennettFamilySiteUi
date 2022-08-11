import { TestBed } from '@angular/core/testing';

import { RecipeStepUpdateService } from './recipe-step-update.service';

describe('RecipeStepUpdateService', () => {
  let service: RecipeStepUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeStepUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
