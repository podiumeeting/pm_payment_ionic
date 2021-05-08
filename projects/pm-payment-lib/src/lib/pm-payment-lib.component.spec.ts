import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmPaymentLibComponent } from './pm-payment-lib.component';

describe('PmPaymentLibComponent', () => {
  let component: PmPaymentLibComponent;
  let fixture: ComponentFixture<PmPaymentLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmPaymentLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmPaymentLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
