import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CHECKOUT} from "../shared/api-url";
import {ProductRequest} from "../model/product-request";
import {StripeResponse} from "../model/stripe-response";
import {AuthHelper} from "../shared/auth-helper";

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  domain = 'http://localhost:8080'

  constructor(private httpClient: HttpClient) {
  }

  checkout(productRequest: ProductRequest): Observable<StripeResponse> {
    return this.httpClient.post<StripeResponse>(this.domain + CHECKOUT, productRequest, AuthHelper.getHeaderWithToken());
  }

}

