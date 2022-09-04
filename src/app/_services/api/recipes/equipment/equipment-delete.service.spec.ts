import { TestBed } from '@angular/core/testing';

import { EquipmentDeleteService } from "./equipment-delete.service";

describe('EquipmentDeleteService', () => {
  let service: EquipmentDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
