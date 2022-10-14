import { TestBed } from '@angular/core/testing';

import { MapboxKeyReadService } from './mapbox-key-read.service';

describe('MapboxKeyReadService', () => {
  let service: MapboxKeyReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapboxKeyReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
