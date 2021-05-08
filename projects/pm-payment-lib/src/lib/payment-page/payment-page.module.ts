import { PaymentPageRoutingModule } from './payment-page-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PaymentPageComponent} from './payment-page.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PaymentPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [PaymentPageComponent]
})
export class PaymentPageModule {}
