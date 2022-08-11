import { TestBed } from '@angular/core/testing';

import { EquipmentCreateService } from './equipment-create.service';

describe('EquipmentCreateService', () => {
  let service: EquipmentCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
