import {Component, Injector, Input, OnInit} from '@angular/core';
import {PmPaymentLibService} from '../pm-payment-lib.service';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {Payment} from '../interfaces/payment';
import {ConfigurationPaymentGateway} from '../interfaces/configuration-payment-gateway';
import {PaymentGateway} from '../enums/payment-gateway.enum';
import {FormPayment} from '../enums/form-payment.enum';
import {Form, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TitleCasePipe} from '@angular/common';
import {PaymentService} from '../interfaces/payment-service';

@Component({
  selector: 'dev-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {
  @Input() pmToken: string;
  payment: Payment = {};
  paymentMethods: ConfigurationPaymentGateway[];
  paymentGateway = PaymentGateway;
  formPayment = FormPayment;
  paymentMethodSelected = null;
  formPaymentConfigurationSelected = null;
  services: any = {};
  paymentService: any = null;
  form: FormGroup;
  totalToPay = 0;
  cardPlaceholders = {
    name: '',
    number: 'xxxx xxxx xxxx xxxx',
    expiry: 'MM/YY',
    cvc: 'xxx'
  };
  cardMessages = {
    validDate: 'valid\nthru',
    monthYear: 'MM/YYYY',
  };

  constructor(private restService: PmPaymentLibService,
              private injector: Injector,
              private titleCasePipe: TitleCasePipe,
              private formBuilder: FormBuilder,
              private modalController: ModalController,
              private alertController: AlertController,
              private loadingController: LoadingController) {
  }

  ngOnInit(): void {
    this.loadPaymentData();
  }

  async loadPaymentData(): Promise<any>{
    const loading = await this.loadingController.create();
    await loading.present();
    this.restService.getPaymentOrder(this.pmToken).subscribe(async (response: any) => {
        await loading.dismiss();
        this.payment = response.payment;
        this.paymentMethods = response.payment_methods;
      },
      async (response) => {
        await loading.dismiss();
        await this.presentErrorAlert();
      });
  }

  selectPaymentMethod(paymentMethod, formPaymentConfiguration): void{
    this.paymentMethodSelected = paymentMethod;
    this.formPaymentConfigurationSelected = formPaymentConfiguration;
    this.buildForm();
    const name = `${this.titleCasePipe.transform(paymentMethod.payment_gateway.name.toLowerCase().replaceAll('_', ' ')).replace(/ /g, '')}V${paymentMethod.payment_gateway.version.replaceAll('.', '')}Service`;
    this.paymentService = this.injector.get<PaymentService>(name as any);
    this.paymentService.initialize(this.paymentMethodSelected, this.formPaymentConfigurationSelected);
  }

  async processPayment(): Promise<void> {
    const loading = await this.loadingController.create();
    await loading.present();
    const params = this.form.value;
    params.pm_token = this.pmToken;
    this.paymentService.pay(params).then(async (response) => {
      await loading.dismiss();
      this.closeSuccess();
    }, async (response) => {
      await loading.dismiss();
      await this.presentErrorAlert(response.error.message);
    });
  }

  private buildForm(): void {
    switch (this.paymentMethodSelected.payment_gateway_id + '-' + this.formPaymentConfigurationSelected.form_payment_id){
      case this.paymentGateway.CONEKTA + '-' + this.formPayment.CREDIT_CARD:
        this.form = this.formBuilder.group({
          cardholder_name: ['', [Validators.required]],
          cardholder_email: ['', [Validators.required]],
          cardholder_phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          card_number: [null, [Validators.required]],
          card_exp_month: [null, []],
          card_exp_year: [null, []],
          card_expiry: [null, [Validators.required]],
          card_ccv: [null, [Validators.required]],
          monthly_installments: [null, [Validators.required]]
        });
        break;
      case this.paymentGateway.CONEKTA + '-' + this.formPayment.DEBIT_CARD:
        this.form = this.formBuilder.group({
          cardholder_name: ['', [Validators.required]],
          cardholder_email: ['', [Validators.required]],
          cardholder_phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          card_number: [null, [Validators.required]],
          card_exp_month: [null, []],
          card_exp_year: [null, []],
          card_expiry: [null, [Validators.required]],
          card_ccv: [null, [Validators.required]],
        });
        break;
      case this.paymentGateway.CASH_ON_DELIVERY + '-' + this.formPayment.CASH:
        this.form = this.formBuilder.group({});
        break;
    }
  }

  showFormPayments(): void{
    this.paymentMethodSelected = null;
    this.formPaymentConfigurationSelected = null;
  }

  async changeInput(event): Promise<void> {
    const focusEvent = new Event('focus');
    const blurEvent = new Event('blur');
    event.target.dispatchEvent(focusEvent);
    event.target.dispatchEvent(blurEvent);
  }

  async focusInput(event): Promise<void> {
    const focusEvent = new Event('focus');
    event.target.dispatchEvent(focusEvent);
  }

  async blurInput(event): Promise<void> {
    const blurEvent = new Event('blur');
    event.target.dispatchEvent(blurEvent);
  }

  changeCardExpiry(): void{
    const expiryDate = this.form.controls.card_expiry.value;
    const [month, year] = expiryDate.replaceAll(' ', '').split('/');
    this.form.controls.card_exp_month.setValue(month);
    this.form.controls.card_exp_year.setValue(year);
  }

  getTotal(monthConfig): number{
    const comission = monthConfig.commission;
    const total = Number(((comission * this.payment.total) + Number(this.payment.total)));
    return total;
  }

  setTotalToPay(total): void{
    this.totalToPay = total;
  }

  generateArrayOfYears(): number[] {
    const max = new Date().getFullYear() + 10;
    const min = new Date().getFullYear();
    const years = [];

    for (let i = min; i < max; i++) {
      years.push(i);
    }
    return years;
  }

  async presentAlert(options): Promise<any> {
    const alert = await this.alertController.create(options);
    return alert.present();
  }

  async presentErrorAlert(errorMessage = ''): Promise<any> {
    if (errorMessage === ''){
      errorMessage = 'Ocurrio un problema, intenta de nuevo más tarde';
    }
    await this.presentAlert({
      header: 'Oops',
      message: errorMessage,
      buttons: ['OK']
    });
  }

  closeModal(): void{
    const data = {success: false, message: ''};
    this.modalController.dismiss(data);
  }

  closeSuccess(): void{
    const data = {success: true, message: ''};
    this.modalController.dismiss(data);
  }

}
