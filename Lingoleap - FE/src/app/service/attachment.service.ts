import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthHelper} from "../shared/auth-helper";
import {environment} from "../../environments/environment";
import {StripeResponse} from "../model/stripe-response";
import {CHECKOUT, PREMIUM} from "../shared/api-url";

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  domain = environment.domain;
  audio = new Audio();

  constructor(private httpClient: HttpClient) {
  }

  uploadFile(wordId: string) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mp3';
    input.click();

    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        const selectedFile = input.files[0];

        this.upload(wordId, selectedFile).subscribe({
          next: (response) => console.log('Upload successful:', response),
          error: (err) => console.error('Upload failed:', err)
        });
      }
    };
  }

  downloadFile(){
    this.download().subscribe((blob) => {
      let objectUrl = URL.createObjectURL(blob);
      this.audio.src = objectUrl;
      this.audio.play();
    });
  }

  download(): Observable<Blob> {
    return this.httpClient.get(this.domain + '/at/download/hello.mp3', {
      responseType: 'blob',
    });
  }

  upload(wordId: string, file: File): Observable<boolean> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<boolean>(`${this.domain}/at/upload/${wordId}`, formData);
  }

}
