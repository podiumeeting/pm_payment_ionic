import {InjectionToken, NgModule, ModuleWithProviders} from '@angular/core';
import { PmPaymentLibComponent } from './pm-payment-lib.component';
import { PaymentPageComponent } from './payment-page/payment-page.component';
import {CommonModule, TitleCasePipe} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {IonicModule} from '@ionic/angular';
import {PmPaymentLibService} from './pm-payment-lib.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConektaV200Service} from "./services/conekta-v2-0-0.service";

export interface LibConfig {
  apiUrl: string;
}

export const LibConfigService = new InjectionToken<LibConfig>('LibConfig');

@NgModule({
  declarations: [PmPaymentLibComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{provide: 'ConektaV200Service', useExisting: ConektaV200Service}],
  exports: [PmPaymentLibComponent]
})
export class PmPaymentLibModule {
  static forRoot(config: LibConfig): ModuleWithProviders<any> {
    return {
      ngModule: PmPaymentLibModule,
      providers: [
        TitleCasePipe,
        PmPaymentLibService,
        {
          provide: LibConfigService,
          useValue: config
        }
      ]
    };
  }
}
