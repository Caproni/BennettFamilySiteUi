import { TestBed } from '@angular/core/testing';

import { EquipmentUsageReadService } from './equipment-usage-read.service';

describe('EquipmentUsageReadService', () => {
  let service: EquipmentUsageReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentUsageReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
