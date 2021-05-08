import {FormPayment} from './form-payment';

export interface FormPaymentConfiguration {
  id?: number;
  configuration_payment_gateway_id?: number;
  form_payment_id?: number;
  is_active?: boolean;
  is_administrative_available?: boolean;
  is_online_available?: boolean;
  created_at?: string;
  updated_at?: string;
  form_payment: FormPayment;
}
