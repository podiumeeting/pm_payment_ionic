export interface PaymentService {
  pay(params): Promise<void>;
  initialize(configurationPaymentGateway, formPaymentConfiguration): Promise<void>;
}
