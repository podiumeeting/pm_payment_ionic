import {Inject, Injectable} from '@angular/core';
import {LibConfig, LibConfigService} from './pm-payment-lib.module';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PmPaymentLibService {
  baseUrl = this.config.apiUrl;
  constructor(@Inject(LibConfigService) private config: LibConfig, private http: HttpClient) { }

  getPaymentOrder(pmToken): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/payment_orders/form?pm_token=${pmToken}`);
  }
}
