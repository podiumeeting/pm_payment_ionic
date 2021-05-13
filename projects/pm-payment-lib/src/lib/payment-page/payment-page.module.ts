import { PaymentPageRoutingModule } from './payment-page-routing.module';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PaymentPageComponent} from './payment-page.component';
import {CardModule} from 'ngx-card';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PaymentPageRoutingModule,
        ReactiveFormsModule,
        CardModule
    ],
  declarations: [PaymentPageComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PaymentPageModule {}
