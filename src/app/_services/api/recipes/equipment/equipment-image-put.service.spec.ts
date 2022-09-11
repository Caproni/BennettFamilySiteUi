import { TestBed } from '@angular/core/testing';

import { EquipmentImagePutService } from './equipment-image-put.service';

describe('EquipmentImagePutService', () => {
  let service: EquipmentImagePutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentImagePutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
