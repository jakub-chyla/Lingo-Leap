import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from "rxjs";
import {User} from "../model/user";
import {HttpClient} from "@angular/common/http";
import {LOG_IN, REGISTER} from "../shared/api-url";
import {AuthRequest} from "../model/auth-request";

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

  logIn(authRequest: AuthRequest): Observable<User> {
    return this.httpClient.post<User>(this.domain + LOG_IN, authRequest).pipe(
      tap((response: User) => {
        if (response) {
          this.emitUser(response);
          // localStorage.setItem('token', String(response.token));
        }
      })
    );
  }

  emitUser(user: User) {
    this.userSource.next(user);
  }
}
