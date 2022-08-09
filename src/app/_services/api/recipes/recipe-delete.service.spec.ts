import { TestBed } from '@angular/core/testing';

import { RecipeDeleteService } from "./recipe-delete.service";

describe('RecipeDeleteService', () => {
  let service: RecipeDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
