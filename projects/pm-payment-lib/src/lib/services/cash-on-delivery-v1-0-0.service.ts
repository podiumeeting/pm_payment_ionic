import {Inject, Injectable} from '@angular/core';
import {PaymentService} from '../interfaces/payment-service';
import {LibConfig, LibConfigService} from '../pm-payment-lib.module';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CashOnDeliveryV100Service implements PaymentService{
  PAYMENT_GATEWAY = 12;
  baseUrl = this.config.apiUrl;
  formPayment = null;
  SERVER = 2;
  constructor(@Inject(LibConfigService) private config: LibConfig, private http: HttpClient) { }

  async initialize(configurationPaymentGateway, formPaymentConfiguration): Promise<void> {
    this.formPayment = formPaymentConfiguration.form_payment;
  }

  pay(params): Promise<void>{
    const paymentMethod = 'make_' + this.formPayment.code.toLowerCase() + '_payment';
    return this[paymentMethod](params);
  }

  make_cash_payment(params): Promise<any>{
    let onError;
    let onSuccess;
    const promise = new Promise((successCallback, errorCallback) => {
      onError = errorCallback;
      onSuccess = successCallback;
    });
    const pmToken = params.pm_token;
    const formPaymentId = this.formPayment.id;
    this.http.post(`${this.baseUrl}/payment_orders/create_partiality`, {
      pm_token: pmToken,
      payment_gateway_id: this.PAYMENT_GATEWAY,
      form_payment_id: formPaymentId,
      total: params.total
    }).subscribe((response) => {
      onSuccess(response);
    }, (response) => {
      onError({source: this.SERVER, error: response.error, status: response.status});
    });
    return promise;
  }
}
