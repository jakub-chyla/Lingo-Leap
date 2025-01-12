import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {User} from "../model/user";
import {HttpClient} from "@angular/common/http";
import {LOG_IN, REGISTER} from "../shared/api-url";
import {AuthRequest} from "../model/auth-request";
import {AuthResponse} from "../model/auth-response";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  domain = 'http://localhost:8080'
  private userSource = new BehaviorSubject<User | null>(null);
  user$ = this.userSource.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  createUser(authRequest: AuthRequest): Observable<string> {
    return this.httpClient.post(this.domain + REGISTER, authRequest, {
      responseType: 'text'
    });
  }

  logIn(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(this.domain + LOG_IN, authRequest).pipe(
      tap((response: AuthResponse) => {
        if (response) {
          let user = new User();
          user.id = response.id;
          user.username = authRequest.username;
          user.token = response.accessToken;
          this.emitUser(user);
        }
      })
    );
  }

  emitUser(user: User) {
    this.userSource.next(user);
  }
}
