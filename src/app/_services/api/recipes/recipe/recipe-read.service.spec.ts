import { TestBed } from '@angular/core/testing';

import { RecipeReadService } from './recipe-read.service';

describe('RecipeReadService', () => {
  let service: RecipeReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
