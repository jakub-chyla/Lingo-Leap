import {HttpHeaders} from "@angular/common/http";

export class AuthHelper {
  public static getHeaderWithToken() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };
  }


  public static getToken() {
    return localStorage.getItem('token');
  }

}
