import {Inject, Injectable} from '@angular/core';
import {LibConfig, LibConfigService} from '../pm-payment-lib.module';
import {HttpClient} from '@angular/common/http';
import {PaymentService} from '../interfaces/payment-service';
declare var Conekta;
@Injectable({
  providedIn: 'root'
})
export class ConektaV200Service implements PaymentService{
  scripts = {
    conekta: {name: 'conekta', src: 'https://cdn.conekta.io/js/latest/conekta.js'},
  };
  baseUrl = this.config.apiUrl;
  formPayment = null;
  TOKENIZER = 1;
  SERVER = 2;
  PAYMENT_GATEWAY = 2;
  constructor(@Inject(LibConfigService) private config: LibConfig, private http: HttpClient) { }

  async initialize(configurationPaymentGateway, formPaymentConfiguration): Promise<void> {
    const data = JSON.parse(configurationPaymentGateway.data);
    await this.loadScript('conekta');
    Conekta.setPublicKey(data.public_key);
    Conekta.setLanguage(data.language);
    this.formPayment = formPaymentConfiguration.form_payment;
  }

  pay(params): Promise<void>{
    const paymentMethod = 'make_' + this.formPayment.code.toLowerCase() + '_payment';
    return this[paymentMethod](params);
  }

  make_debit_card_payment(params): Promise<any>{
    let onError;
    let onSuccess;
    const promise = new Promise((successCallback, errorCallback) =>{
      onError = errorCallback;
      onSuccess = successCallback;
    });


    const pmToken = params.pm_token;
    const formPaymentId = this.formPayment.id;
    const card = {
      name: params.cardholder_name,
      number: params.card_number,
      cvc: params.card_ccv,
      exp_month: params.card_exp_month,
      exp_year: params.card_exp_year
    };

    Conekta.Token.create({card: card}, (token) => {
      this.http.post(`${this.baseUrl}/payment_orders/create_partiality`, {
          pm_token: pmToken,
          payment_gateway_id: this.PAYMENT_GATEWAY,
          form_payment_id: formPaymentId,
          total: params.total,
          card_token: token,
          phone: params.cardholder_phone.toString(),
          name: params.cardholder_name,
          email: params.cardholder_email
        }).subscribe((response) => {
          onSuccess(response);
        }, (response) => {
          onError({source: this.SERVER, error: response.data, status: response.status});
        });
      }, (response) => {
        onError({source: this.TOKENIZER, error: response.message_to_purchaser});
      }
    );
    return promise;
  }

  make_credit_card_payment(params): Promise<any>{
    let onError;
    let onSuccess;
    const promise = new Promise((successCallback, errorCallback) => {
      onError = errorCallback;
      onSuccess = successCallback;
    });

    const pmToken = params.pm_token;
    const formPaymentId = this.formPayment.id;
    const card = {
      name: params.cardholder_name,
      number: params.card_number,
      cvc: params.card_ccv,
      exp_month: params.card_exp_month,
      exp_year: params.card_exp_year
    };

    Conekta.Token.create({card: card}, (token) => {
      this.http.post(`${this.baseUrl}/payment_orders/create_partiality`, {
          pm_token: pmToken,
          payment_gateway_id: this.PAYMENT_GATEWAY,
          form_payment_id: formPaymentId,
          total: params.total,
          card_token: token,
          monthly_installments: params.monthly_installments,
          phone: params.cardholder_phone.toString(),
          name: params.cardholder_name,
          email: params.cardholder_email
        }).subscribe((response) => {
          onSuccess(response);
        }, (response) => {
          onError({source: this.SERVER, error: response.data, status: response.status});
        });
    }, (response) => {
      onError({source: this.TOKENIZER, error: response.message_to_purchaser});
    });
    return promise;
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({script: name, loaded: true, status: 'Already Loaded'});
      }
      else {
        // load script
        const script: any = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  // IE
          script.onreadystatechange = () => {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({script: name, loaded: true, status: 'Loaded'});
            }
          };
        } else {  // Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({script: name, loaded: true, status: 'Loaded'});
          };
        }
        script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
}
