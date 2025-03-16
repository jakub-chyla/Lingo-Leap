import { Injectable } from '@angular/core';
import {Progress} from "../model/progress";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private progress = 'progress';

  saveObject(obj: Progress): void {
    localStorage.setItem(this.progress, JSON.stringify(obj));
  }

  getProgress(): Progress | null {
    const data = localStorage.getItem(this.progress);
    return data ? JSON.parse(data) : null;
  }

  removeProgress(): void {
    localStorage.removeItem(this.progress);
  }
}
