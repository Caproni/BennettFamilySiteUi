import { TestBed } from '@angular/core/testing';

import { DogCeoApiService } from './dog-ceo-api.service';

describe('DogCeoApiService', () => {
  let service: DogCeoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DogCeoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
