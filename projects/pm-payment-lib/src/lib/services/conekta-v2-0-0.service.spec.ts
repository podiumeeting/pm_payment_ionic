import { TestBed } from '@angular/core/testing';

import { ConektaV200Service } from './conekta-v2-0-0.service';

describe('ConektaV200Service', () => {
  let service: ConektaV200Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConektaV200Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
