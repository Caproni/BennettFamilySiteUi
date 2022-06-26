import { TestBed } from '@angular/core/testing';

import { RecipeUploadService } from './recipe-upload.service';

describe('RecipeUploadService', () => {
  let service: RecipeUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
