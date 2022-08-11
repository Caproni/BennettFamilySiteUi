import { TestBed } from '@angular/core/testing';

import { EquipmentReadService } from './equipment-read.service';

describe('EquipmentReadService', () => {
  let service: EquipmentReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
