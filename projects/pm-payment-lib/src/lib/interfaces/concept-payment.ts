export interface ConceptPayment {
  id?: number;
  amount?: number;
  concept_id?: number;
  concept_type?: string;
  description?: string;
  origin_price?: number;
  payment_id?: number;
  price?: number;
  total?: number;
  created_at?: string;
  updated_at?: string;
}
