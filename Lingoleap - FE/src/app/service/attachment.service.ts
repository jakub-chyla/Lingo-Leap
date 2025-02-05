import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthHelper} from "../shared/auth-helper";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  domain = environment.domain;

  constructor(private httpClient: HttpClient) {
  }

  download(): Observable<Blob> {
    console.log(this.domain + '/at/download/hello.mp3')
    return this.httpClient.get(this.domain + '/at/download/hello.mp3', {
      responseType: 'blob',
    });
  }


}
