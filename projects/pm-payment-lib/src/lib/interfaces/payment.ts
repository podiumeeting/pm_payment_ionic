import {ConceptPayment} from './concept-payment';
import {TypeMoney} from './type-money';

export interface Payment {
  id?: number;
  concept_payments?: ConceptPayment[];
  type_money?: TypeMoney;
  subtotal?: number;
  total?: number;
  discount?: number;
}
