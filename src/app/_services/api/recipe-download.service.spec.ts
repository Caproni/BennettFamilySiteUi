import { TestBed } from '@angular/core/testing';

import { RecipeDownloadService } from './recipe-download.service';

describe('RecipeDownloadService', () => {
  let service: RecipeDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
