import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageSubject = new BehaviorSubject(null);

  watchStorage(): BehaviorSubject<any> {
    return this.storageSubject;
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, value);
    this.storageSubject.next({ key, value });
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.storageSubject.next({ key, value: null });
  }
}
