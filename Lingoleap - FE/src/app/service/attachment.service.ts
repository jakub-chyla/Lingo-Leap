import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Language} from "../enum/Language";
import {Attachment} from "../model/attachment";
import {ATTACHMENT, WORD} from "../shared/api-url";
import {AuthHelper} from "../shared/auth-helper";

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  domain = environment.domain;
  audio = new Audio();

  constructor(private httpClient: HttpClient) {
  }

  uploadFile(wordId: string, language: Language) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.mp3';
    input.click();

    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        const selectedFile = input.files[0];
        this.upload(wordId, language, selectedFile).subscribe({
          next: (response) => console.log('Upload successful:', response),
          error: (err) => console.error('Upload failed:', err)
        });
      }
    };
  }

  // downloadFile() {
  //   this.download().subscribe((blob) => {
  //     let objectUrl = URL.createObjectURL(blob);
  //     this.audio.src = objectUrl;
  //     this.audio.play();
  //   });
  // }

  download(wordId: string): Observable<Blob> {
    return this.httpClient.get(this.domain + ATTACHMENT + `/download/${wordId}`, {
      responseType: 'blob',
    });
  }

  upload(wordId: string, language: Language, file: File): Observable<Attachment> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<Attachment>(`${this.domain}/at/upload/${wordId}/${Language[language]}`, formData, AuthHelper.getHeaderWithToken());
  }

  deleteAttachmentById(attachmentId: string): Observable<number> {
    return this.httpClient.delete<number>(this.domain + ATTACHMENT + `/${attachmentId}`, AuthHelper.getHeaderWithToken());
  }

}
