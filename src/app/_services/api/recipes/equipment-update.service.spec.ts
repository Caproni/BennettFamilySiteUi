import { TestBed } from '@angular/core/testing';

import { EquipmentUpdateService } from './equipment-update.service';

describe('EquipmentUpdateService', () => {
  let service: EquipmentUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
