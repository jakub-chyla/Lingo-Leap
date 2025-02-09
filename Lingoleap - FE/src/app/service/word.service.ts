import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ProductRequest} from "../model/product-request";
import {Observable} from "rxjs";
import {StripeResponse} from "../model/stripe-response";
import {CHECKOUT, WORD} from "../shared/api-url";
import {AuthHelper} from "../shared/auth-helper";
import {Word} from "../model/word";

@Injectable({
  providedIn: 'root'
})
export class WordService {
  domain = environment.domain;
  constructor(private httpClient: HttpClient) {
  }

  saveWord(word: Word): Observable<Word> {
    return this.httpClient.post<Word>(this.domain + WORD, word);
  }

  getAllWords(): Observable<Word[]> {
    return this.httpClient.get<Word[]>(this.domain + WORD);
  }

  deleteById(wordId: string): Observable<number>{
    return this.httpClient.delete<number>(this.domain + WORD + `/${wordId}`);
  }
}
