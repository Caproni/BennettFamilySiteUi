import { TestBed } from '@angular/core/testing';

import { RecipeUpdateService } from './recipe-update.service';

describe('RecipeUpdateService', () => {
  let service: RecipeUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
