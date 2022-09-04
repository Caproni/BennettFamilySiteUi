import { TestBed } from '@angular/core/testing';

import { RecipeStepImagePutService } from './recipe-step-image-put.service';

describe('RecipeStepImagePutService', () => {
  let service: RecipeStepImagePutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeStepImagePutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
