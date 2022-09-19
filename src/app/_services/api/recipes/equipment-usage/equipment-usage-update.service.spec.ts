import { TestBed } from '@angular/core/testing';

import { EquipmentUsageUpdateService } from './equipment-usage-update.service';

describe('EquipmentUsageUpdateService', () => {
  let service: EquipmentUsageUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentUsageUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
