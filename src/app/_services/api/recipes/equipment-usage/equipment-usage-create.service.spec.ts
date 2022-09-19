import { TestBed } from '@angular/core/testing';

import { EquipmentUsageCreateService } from './equipment-usage-create.service';

describe('EquipmentUsageCreateService', () => {
  let service: EquipmentUsageCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentUsageCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
