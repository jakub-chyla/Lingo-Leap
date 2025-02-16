import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ProductRequest} from "../model/product-request";
import {Observable} from "rxjs";
import {StripeResponse} from "../model/stripe-response";
import {CHECKOUT, RANDOM_WORD, WORD} from "../shared/api-url";
import {AuthHelper} from "../shared/auth-helper";
import {Word} from "../model/word";
import {RandomWord} from "../model/randomWord";
import {Language} from "../enum/Language";

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

  getRandomWords(language: Language): Observable<Word[]> {
    return this.httpClient.get<Word[]>(this.domain + RANDOM_WORD + `/${Language[language]}`);
  }

  deleteWordById(wordId: string): Observable<number>{
    return this.httpClient.delete<number>(this.domain + WORD + `/${wordId}`);
  }
}
