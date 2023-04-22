import { TestBed } from '@angular/core/testing';

import { BankHolidayReadService } from './bank-holiday-read.service';

describe('BankHolidayReadService', () => {
  let service: BankHolidayReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankHolidayReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
