import { TestBed } from '@angular/core/testing';

import { CashOnDeliveryV100Service } from './cash-on-delivery-v1-0-0.service';

describe('CashOnDeliveryV100Service', () => {
  let service: CashOnDeliveryV100Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashOnDeliveryV100Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
