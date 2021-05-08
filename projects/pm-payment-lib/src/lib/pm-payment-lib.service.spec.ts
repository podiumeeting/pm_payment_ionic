import { TestBed } from '@angular/core/testing';

import { PmPaymentLibService } from './pm-payment-lib.service';

describe('PmPaymentLibService', () => {
  let service: PmPaymentLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PmPaymentLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
