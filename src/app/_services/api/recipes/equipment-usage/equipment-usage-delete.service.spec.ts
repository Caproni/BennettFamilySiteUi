import { TestBed } from '@angular/core/testing';

import { EquipmentUsageDeleteService } from "./equipment-usage-delete.service";

describe('EquipmentUsageDeleteService', () => {
  let service: EquipmentUsageDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentUsageDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
