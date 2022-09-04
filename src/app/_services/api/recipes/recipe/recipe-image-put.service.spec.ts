import { TestBed } from '@angular/core/testing';

import { RecipeImagePutService } from './recipe-image-put.service';

describe('RecipeImagePutService', () => {
  let service: RecipeImagePutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeImagePutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
