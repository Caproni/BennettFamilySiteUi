import { TestBed } from '@angular/core/testing';

import { RecipeCreateService } from './recipe-create.service';

describe('RecipeCreateService', () => {
  let service: RecipeCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
