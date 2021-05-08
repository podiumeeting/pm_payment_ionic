import {FormPaymentConfiguration} from './form-payment-configuration';
import {PaymentGateway} from './payment-gateway';

export interface ConfigurationPaymentGateway {
  payment_gateway: PaymentGateway;
  id?: number;
  payment_gateway_id?: number;
  form_payment_configurations: FormPaymentConfiguration[];
}
