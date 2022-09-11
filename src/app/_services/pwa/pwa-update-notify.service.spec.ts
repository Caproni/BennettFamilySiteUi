import { TestBed } from '@angular/core/testing';

import { PwaUpdateNotifyService } from './pwa-update-notify.service';

describe('PwaUpdateNotifyService', () => {
  let service: PwaUpdateNotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaUpdateNotifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
