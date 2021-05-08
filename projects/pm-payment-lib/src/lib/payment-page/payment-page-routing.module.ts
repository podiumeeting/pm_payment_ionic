import {RouterModule, Routes} from '@angular/router';
import {PaymentPageComponent} from './payment-page.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: PaymentPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentPageRoutingModule { }
