import { TestBed } from '@angular/core/testing';

import { RecipeDetailReadService } from './recipe-detail-read.service';

describe('RecipeDetailReadService', () => {
  let service: RecipeDetailReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeDetailReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
