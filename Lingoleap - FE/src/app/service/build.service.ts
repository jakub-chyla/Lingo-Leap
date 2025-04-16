import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PurchaseService} from "./purchase.service";
import {Observable} from "rxjs";
import {AuthHelper} from "../shared/auth-helper";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BuildService {
  domain = environment.domain;

  constructor(private httpClient: HttpClient) {
  }

  getBuildTime(): Observable<string> {
    return this.httpClient.get<string>(this.domain +'/build');
  }
}
